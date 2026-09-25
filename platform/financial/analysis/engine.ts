import type {
  FinancialAccount,
  FinancialTransaction,
} from "../types";

import type {
  FinancialAnalysisFinding,
  FinancialAnalysisMetric,
  FinancialAnalysisRequest,
  FinancialAnalysisResult,
  FinancialAnalysisTrend,
  FinancialAnalysisVariance,
  FinancialChart,
  FinancialDataQuality,
  FinancialRecommendation,
  FinancialStatement,
  FinancialStatementAnalysis,
  FinancialStatementLine,
} from "./types";

const DEFAULT_COST_KEYWORDS = [
  "costo de ventas",
  "costos de ventas",
  "cost of sales",
  "cost of goods sold",
  "cogs",
  "costo mercanc",
  "materia prima",
  "material directo",
  "mano de obra directa",
];

const round = (n: number) =>
  Math.round((n + Number.EPSILON) * 100) / 100;

const pct = (
  n: number,
  b: number,
): number | null =>
  b === 0
    ? null
    : round((n / Math.abs(b)) * 100);

const amount = (value: unknown): number =>
  typeof value === "number" &&
  Number.isFinite(value)
    ? value
    : 0;

type Summary = {
  revenue: number;
  costOfSales: number;
  grossProfit: number;
  operatingExpenses: number;
  operatingProfit: number;
  otherIncome: number;
  otherExpenses: number;
  netProfit: number;
  assets: number;
  liabilities: number;
  equity: number;
  cashFlow: number;
};

export class FinancialAnalysisEngine {
  analyze(
    request: FinancialAnalysisRequest,
    transactions: FinancialTransaction[],
    accounts: FinancialAccount[],
    comparisonTransactions: FinancialTransaction[] = [],
  ): FinancialAnalysisResult {
    const tx = transactions.filter(
      (transaction) =>
        transaction.organizationId ===
          request.context.organizationId &&
        transaction.workspaceId ===
          request.context.workspaceId &&
        (!request.classification ||
          !transaction.classification ||
          transaction.classification ===
            request.classification),
    );

    const previousTransactions =
      comparisonTransactions.filter(
        (transaction) =>
          transaction.organizationId ===
            request.context.organizationId &&
          transaction.workspaceId ===
            request.context.workspaceId &&
          (!request.classification ||
            !transaction.classification ||
            transaction.classification ===
              request.classification),
      );

    const accountMap =
      new Map<string, FinancialAccount>();

    accounts.forEach((account) => {
      if (account.id) {
        accountMap.set(account.id, account);
      }
    });

    const current = this.summary(
      tx,
      accountMap,
      request,
    );

    const previous = this.summary(
      previousTransactions,
      accountMap,
      request,
    );

    const currency =
      tx.find(
        (transaction) => transaction.currency,
      )?.currency;

    const findings = this.findings(
      current,
      previous,
      tx,
      accounts,
      previousTransactions.length > 0,
    );

    const dataQuality = this.quality(
      tx,
      accounts,
      current,
    );

    const result: FinancialAnalysisResult = {
      analysisType: request.analysisType,
      context: request.context,
      periodId: request.periodId,
      currency,

      metrics: this.metrics(
        current,
        currency,
      ),

      trends: this.trends(
        current,
        previous,
      ),

      variances:
        previousTransactions.length > 0
          ? this.variances(
              current,
              previous,
            )
          : [],

      findings,

      dataQuality,

      summary: {
        ...current,

        grossMargin: pct(
          current.grossProfit,
          current.revenue,
        ),

        operatingMargin: pct(
          current.operatingProfit,
          current.revenue,
        ),

        netMargin: pct(
          current.netProfit,
          current.revenue,
        ),

        balanceCheckDifference:
          round(
            current.assets -
              current.liabilities -
              current.equity,
          ),
      },
    };

    if (
      request.includeStatements !== false
    ) {
      result.statements =
        this.statements(
          current,
          tx,
          currency,
        );
    }

    if (
      request.includeCharts !== false
    ) {
      result.charts =
        this.charts(
          current,
          previous,
          previousTransactions.length > 0,
        );
    }

    if (
      request.includeRecommendations !== false
    ) {
      result.recommendations =
        this.recommendations(
          current,
          previous,
          dataQuality,
        );
    }

    return result;
  }

  private summary(
    transactions: FinancialTransaction[],
    accounts: Map<
      string,
      FinancialAccount
    >,
    request: FinancialAnalysisRequest,
  ): Summary {
    let revenue = 0;
    let costOfSales = 0;
    let operatingExpenses = 0;
    let assets = 0;
    let liabilities = 0;
    let equity = 0;

    const configuredCodes =
      new Set(
        (
          request.costAccountCodes ??
          []
        ).map((code) =>
          code.toLowerCase(),
        ),
      );

    const keywords = (
      request.costAccountKeywords
        ?.length
        ? request.costAccountKeywords
        : DEFAULT_COST_KEYWORDS
    ).map((keyword) =>
      keyword.toLowerCase(),
    );

    for (const transaction of transactions) {
      const value = amount(
        transaction.amount,
      );

      if (!value) {
        continue;
      }

      if (
        transaction.type ===
        "revenue"
      ) {
        revenue += value;
      } else if (
        transaction.type ===
        "expense"
      ) {
        const account =
          accounts.get(
            transaction.accountId,
          );

        const searchableText =
          `${account?.code ?? ""} ${
            account?.name ?? ""
          } ${
            transaction.description ?? ""
          }`.toLowerCase();

        const isConfiguredCost =
          Boolean(
            account?.code &&
              configuredCodes.has(
                account.code.toLowerCase(),
              ),
          );

        const isKeywordCost =
          keywords.some((keyword) =>
            searchableText.includes(
              keyword,
            ),
          );

        if (
          isConfiguredCost ||
          isKeywordCost
        ) {
          costOfSales += value;
        } else {
          operatingExpenses += value;
        }
      } else if (
        transaction.type ===
        "asset"
      ) {
        assets += value;
      } else if (
        transaction.type ===
        "liability"
      ) {
        liabilities += value;
      } else if (
        transaction.type ===
        "equity"
      ) {
        equity += value;
      }
    }

    const grossProfit =
      revenue - costOfSales;

    const operatingProfit =
      grossProfit -
      operatingExpenses;

    const netProfit =
      operatingProfit;

    return {
      revenue: round(revenue),
      costOfSales: round(
        costOfSales,
      ),
      grossProfit: round(
        grossProfit,
      ),
      operatingExpenses: round(
        operatingExpenses,
      ),
      operatingProfit: round(
        operatingProfit,
      ),
      otherIncome: 0,
      otherExpenses: 0,
      netProfit: round(
        netProfit,
      ),
      assets: round(assets),
      liabilities: round(
        liabilities,
      ),
      equity: round(equity),
      cashFlow: round(
        revenue -
          costOfSales -
          operatingExpenses,
      ),
    };
  }

  private metrics(
    summary: Summary,
    currency?: string,
  ): FinancialAnalysisMetric[] {
    const metrics: FinancialAnalysisMetric[] =
      [
        [
          "revenue",
          summary.revenue,
        ],
        [
          "cost_of_sales",
          summary.costOfSales,
        ],
        [
          "gross_profit",
          summary.grossProfit,
        ],
        [
          "operating_expenses",
          summary.operatingExpenses,
        ],
        [
          "operating_profit",
          summary.operatingProfit,
        ],
        [
          "net_profit",
          summary.netProfit,
        ],
        [
          "assets",
          summary.assets,
        ],
        [
          "liabilities",
          summary.liabilities,
        ],
        [
          "equity",
          summary.equity,
        ],
        [
          "cash_flow",
          summary.cashFlow,
        ],
      ].map(
        ([name, value]) => ({
          name: String(name),
          label: String(name),
          value: Number(value),
          unit: "currency",
          ...(currency
            ? { currency }
            : {}),
        }),
      );

    const margins = [
      [
        "gross_margin",
        pct(
          summary.grossProfit,
          summary.revenue,
        ),
      ],
      [
        "operating_margin",
        pct(
          summary.operatingProfit,
          summary.revenue,
        ),
      ],
      [
        "net_margin",
        pct(
          summary.netProfit,
          summary.revenue,
        ),
      ],
    ] as const;

    for (
      const [name, value] of margins
    ) {
      if (value !== null) {
        metrics.push({
          name,
          label: name,
          value,
          unit: "percentage",
        });
      }
    }

    return metrics;
  }

  private trends(
    current: Summary,
    previous: Summary,
  ): FinancialAnalysisTrend[] {
    if (
      !previous.revenue &&
      !previous.costOfSales &&
      !previous.operatingExpenses &&
      !previous.netProfit
    ) {
      return [];
    }

    return [
      [
        "revenue",
        current.revenue,
        previous.revenue,
      ],
      [
        "cost_of_sales",
        current.costOfSales,
        previous.costOfSales,
      ],
      [
        "operating_expenses",
        current.operatingExpenses,
        previous.operatingExpenses,
      ],
      [
        "gross_profit",
        current.grossProfit,
        previous.grossProfit,
      ],
      [
        "operating_profit",
        current.operatingProfit,
        previous.operatingProfit,
      ],
      [
        "net_profit",
        current.netProfit,
        previous.netProfit,
      ],
    ].map(
      ([metric, currentValue, previousValue]) => {
        const change = round(
          Number(currentValue) -
            Number(previousValue),
        );

        return {
          metric: String(metric),
          currentValue:
            Number(currentValue),
          previousValue:
            Number(previousValue),
          change,
          changePercentage:
            Number(previousValue) === 0
              ? Number(currentValue) ===
                0
                ? 0
                : 100
              : round(
                  (change /
                    Math.abs(
                      Number(
                        previousValue,
                      ),
                    )) *
                    100,
                ),
          direction:
            change > 0
              ? "up"
              : change < 0
                ? "down"
                : "stable",
        };
      },
    );
  }

  private variances(
    current: Summary,
    previous: Summary,
  ): FinancialAnalysisVariance[] {
    return this.trends(
      current,
      previous,
    ).map((trend) => ({
      metric: trend.metric,
      actual: trend.currentValue,
      reference:
        trend.previousValue,
      variance: trend.change,
      variancePercentage:
        trend.changePercentage,
      direction:
        trend.change > 0
          ? "above"
          : trend.change < 0
            ? "below"
            : "equal",
    }));
  }

  private findings(
    current: Summary,
    previous: Summary,
    transactions: FinancialTransaction[],
    accounts: FinancialAccount[],
    hasPrevious: boolean,
  ): FinancialAnalysisFinding[] {
    const findings: FinancialAnalysisFinding[] =
      [];

    if (!transactions.length) {
      findings.push({
        type: "warning",
        metric: "data",
        message:
          "No financial transactions were available for the selected period.",
        severity: "critical",
      });

      return findings;
    }

    if (
      current.netProfit > 0
    ) {
      findings.push({
        type: "positive",
        metric: "profitability",
        message:
          "El periodo analizado muestra una rentabilidad neta positiva.",
        evidence: [
          `Revenue: ${current.revenue}`,
          `Net profit: ${current.netProfit}`,
        ],
        severity: "low",
      });
    } else if (
      current.netProfit < 0
    ) {
      findings.push({
        type: "negative",
        metric: "profitability",
        message:
          "The analyzed period ends with a net loss.",
        evidence: [
          `Revenue: ${current.revenue}`,
          `Net profit: ${current.netProfit}`,
        ],
        severity: "high",
      });
    }

    const grossMargin = pct(
      current.grossProfit,
      current.revenue,
    );

    if (
      grossMargin !== null &&
      grossMargin < 0
    ) {
      findings.push({
        type: "negative",
        metric: "gross_margin",
        message:
          "Cost of sales exceeds revenue.",
        severity: "critical",
      });
    }

    const balanceDifference =
      current.assets -
      current.liabilities -
      current.equity;

    if (
      current.assets > 0 &&
      Math.abs(
        balanceDifference,
      ) > 0.01
    ) {
      findings.push({
        type: "warning",
        metric: "balance_sheet",
        message:
          "Available balance-sheet data does not balance.",
        evidence: [
          `Difference: ${round(
            balanceDifference,
          )}`,
        ],
        severity: "high",
      });
    }

    if (
      hasPrevious &&
      previous.revenue > 0
    ) {
      const revenueChange =
        ((current.revenue -
          previous.revenue) /
          Math.abs(
            previous.revenue,
          )) *
        100;

      if (
        revenueChange < -10
      ) {
        findings.push({
          type: "negative",
          metric: "revenue",
          message:
            "Revenue declined materially versus the comparison period.",
          evidence: [
            `Variation: ${round(
              revenueChange,
            )}%`,
          ],
          severity: "high",
        });
      }
    }

    if (!accounts.length) {
      findings.push({
        type: "warning",
        metric: "accounts",
        message:
          "Transactions exist without account metadata.",
        severity: "medium",
      });
    }

    return findings;
  }

  private statements(
    summary: Summary,
    transactions: FinancialTransaction[],
    currency?: string,
  ): FinancialStatementAnalysis {
    const line = (
      key: string,
      label: string,
      value: number,
      base: number,
    ): FinancialStatementLine => ({
      key,
      label,
      amount: round(value),
      ...(currency
        ? { currency }
        : {}),
      ...(base
        ? {
            percentageOfBase:
              pct(value, base) ??
              undefined,
          }
        : {}),
    });

    const incomeStatement: FinancialStatement =
      {
        type: "income_statement",
        currency,
        title: "Estado de Resultados",
        available:
          transactions.length > 0,
        completeness:
          summary.revenue ||
          summary.costOfSales ||
          summary.operatingExpenses
            ? 100
            : 0,
        lines: [
          line(
            "revenue",
            "Ingresos",
            summary.revenue,
            summary.revenue,
          ),
          line(
            "cost_of_sales",
            "Costo de ventas",
            summary.costOfSales,
            summary.revenue,
          ),
          line(
            "gross_profit",
            "Utilidad bruta",
            summary.grossProfit,
            summary.revenue,
          ),
          line(
            "operating_expenses",
            "Gastos operativos",
            summary.operatingExpenses,
            summary.revenue,
          ),
          line(
            "operating_profit",
            "Utilidad operativa",
            summary.operatingProfit,
            summary.revenue,
          ),
          line(
            "net_profit",
            "Utilidad neta",
            summary.netProfit,
            summary.revenue,
          ),
        ],
        totals: {
          revenue: summary.revenue,
          costOfSales:
            summary.costOfSales,
          grossProfit:
            summary.grossProfit,
          operatingExpenses:
            summary.operatingExpenses,
          operatingProfit:
            summary.operatingProfit,
          netProfit:
            summary.netProfit,
        },
        warnings: [],
      };

    const balanceDifference =
      round(
        summary.assets -
          summary.liabilities -
          summary.equity,
      );

    const balanceSheet: FinancialStatement =
      {
        type: "balance_sheet",
        currency,
        title: "Balance General",
        available: Boolean(
          summary.assets ||
            summary.liabilities ||
            summary.equity,
        ),
        completeness:
          summary.assets ||
          summary.liabilities ||
          summary.equity
            ? 70
            : 0,
        lines: [
          line(
            "assets",
            "Activos",
            summary.assets,
            summary.assets,
          ),
          line(
            "liabilities",
            "Pasivos",
            summary.liabilities,
            summary.assets,
          ),
          line(
            "equity",
            "Patrimonio",
            summary.equity,
            summary.assets,
          ),
        ],
        totals: {
          assets: summary.assets,
          liabilities:
            summary.liabilities,
          equity: summary.equity,
          balanceDifference,
        },
        warnings:
          Math.abs(
            balanceDifference,
          ) > 0.01
            ? [
                "Activos no coinciden con pasivos más patrimonio.",
              ]
            : [],
      };

    const cashFlow: FinancialStatement =
      {
        type: "cash_flow",
        currency,
        title: "Flujo de Efectivo",
        available:
          transactions.length > 0,
        completeness:
          transactions.length
            ? 50
            : 0,
        lines: [
          line(
            "cash_flow_proxy",
            "Flujo operativo estimado",
            summary.cashFlow,
            Math.abs(
              summary.revenue,
            ),
          ),
        ],
        totals: {
          operatingCashFlowProxy:
            summary.cashFlow,
        },
        warnings: [
          "El contrato actual no distingue movimientos de efectivo; este valor es un proxy y no un estado de flujo de efectivo completo.",
        ],
      };

    return {
      incomeStatement,
      balanceSheet,
      cashFlow,
    };
  }

  private charts(
    current: Summary,
    previous: Summary,
    hasPrevious: boolean,
  ): FinancialChart[] {
    const labels = hasPrevious
      ? ["Anterior", "Actual"]
      : ["Actual"];

    const values = (
      previousValue: number,
      currentValue: number,
    ) =>
      hasPrevious
        ? [
            previousValue,
            currentValue,
          ]
        : [currentValue];

    return [
      {
        id: "financial-performance",
        title:
          "Ingresos, costos, gastos y utilidad",
        type: "bar",
        labels,
        series: [
          {
            key: "revenue",
            label: "Ingresos",
            values: values(
              previous.revenue,
              current.revenue,
            ),
            unit: "currency",
          },
          {
            key: "cost_of_sales",
            label: "Costo de ventas",
            values: values(
              previous.costOfSales,
              current.costOfSales,
            ),
            unit: "currency",
          },
          {
            key: "operating_expenses",
            label: "Gastos operativos",
            values: values(
              previous.operatingExpenses,
              current.operatingExpenses,
            ),
            unit: "currency",
          },
          {
            key: "net_profit",
            label: "Utilidad neta",
            values: values(
              previous.netProfit,
              current.netProfit,
            ),
            unit: "currency",
          },
        ],
      },
      {
        id: "financial-margins",
        title:
          "Evolución de márgenes",
        type: "line",
        labels,
        series: [
          {
            key: "gross_margin",
            label: "Margen bruto",
            values: values(
              pct(
                previous.grossProfit,
                previous.revenue,
              ) ?? 0,
              pct(
                current.grossProfit,
                current.revenue,
              ) ?? 0,
            ),
            unit: "percentage",
          },
          {
            key: "operating_margin",
            label: "Margen operativo",
            values: values(
              pct(
                previous.operatingProfit,
                previous.revenue,
              ) ?? 0,
              pct(
                current.operatingProfit,
                current.revenue,
              ) ?? 0,
            ),
            unit: "percentage",
          },
          {
            key: "net_margin",
            label: "Margen neto",
            values: values(
              pct(
                previous.netProfit,
                previous.revenue,
              ) ?? 0,
              pct(
                current.netProfit,
                current.revenue,
              ) ?? 0,
            ),
            unit: "percentage",
          },
        ],
      },
    ];
  }

  private quality(
    transactions: FinancialTransaction[],
    accounts: FinancialAccount[],
    summary: Summary,
  ): FinancialDataQuality {
    const currencies = [
      ...new Set(
        transactions
          .map(
            (transaction) =>
              transaction.currency,
          )
          .filter(Boolean),
      ),
    ];

    const missingAccountReferences =
      transactions.filter(
        (transaction) =>
          !transaction.accountId ||
          !accounts.some(
            (account) =>
              account.id ===
              transaction.accountId,
          ),
      ).length;

    const invalidAmounts =
      transactions.filter(
        (transaction) =>
          typeof transaction.amount !==
            "number" ||
          !Number.isFinite(
            transaction.amount,
          ),
      ).length;

    const missingDates =
      transactions.filter(
        (transaction) =>
          !transaction.date,
      ).length;

    const ids = transactions
      .map(
        (transaction) =>
          transaction.id,
      )
      .filter(Boolean) as string[];

    const duplicateTransactionIds =
      ids.length -
      new Set(ids).size;

    const unclassifiedTransactions =
      transactions.filter(
        (transaction) =>
          !transaction.classification,
      ).length;

    const incomeStatementAvailable =
      Boolean(
        summary.revenue ||
          summary.costOfSales ||
          summary.operatingExpenses,
      );

    const balanceSheetAvailable =
      Boolean(
        summary.assets ||
          summary.liabilities ||
          summary.equity,
      );

    const warnings: string[] =
      [];

    if (
      currencies.length > 1
    ) {
      warnings.push(
        "Existen múltiples monedas en los datos.",
      );
    }

    if (
      missingAccountReferences
    ) {
      warnings.push(
        "Hay transacciones sin cuenta financiera válida.",
      );
    }

    if (invalidAmounts) {
      warnings.push(
        "Hay transacciones con importes inválidos.",
      );
    }

    if (missingDates) {
      warnings.push(
        "Hay transacciones sin fecha.",
      );
    }

    if (
      duplicateTransactionIds
    ) {
      warnings.push(
        "Existen IDs de transacción duplicados.",
      );
    }

    if (
      unclassifiedTransactions
    ) {
      warnings.push(
        "Hay transacciones sin clasificación de datos.",
      );
    }

    if (
      !balanceSheetAvailable
    ) {
      warnings.push(
        "No hay información suficiente para un balance general completo.",
      );
    }

    return {
      transactionCount:
        transactions.length,
      currencies,
      missingAccountReferences,
      invalidAmounts,
      missingDates,
      duplicateTransactionIds,
      unclassifiedTransactions,
      balanceSheetAvailable,
      incomeStatementAvailable,
      cashFlowAvailable:
        transactions.length > 0,
      completeness:
        transactions.length
          ? Math.round(
              ((
                (currencies.length ===
                1
                  ? 1
                  : 0) +
                (missingAccountReferences
                  ? 0
                  : 1) +
                (invalidAmounts
                  ? 0
                  : 1) +
                (missingDates
                  ? 0
                  : 1) +
                (balanceSheetAvailable
                  ? 1
                  : 0) +
                (incomeStatementAvailable
                  ? 1
                  : 0)
              ) /
                6) *
                100,
            )
          : 0,
      warnings,
    };
  }

  private recommendations(
    current: Summary,
    previous: Summary,
    quality: FinancialDataQuality,
  ): FinancialRecommendation[] {
    const recommendations: FinancialRecommendation[] =
      [];

    if (
      current.netProfit < 0
    ) {
      recommendations.push({
        id: "profitability-negative",
        priority: "high",
        area: "profitability",
        problem:
          "La empresa termina el periodo con pérdida.",
        evidence: [
          `Ingresos: ${current.revenue}`,
          `Utilidad neta: ${current.netProfit}`,
        ],
        action:
          "Separar costo de ventas y gastos operativos para identificar qué partidas están absorbiendo el margen.",
        expectedImpact:
          "Identificar las partidas con mayor capacidad de recuperación de margen.",
        confidence: 0.92,
      });
    }

    if (
      current.revenue > 0 &&
      current.costOfSales >
        current.revenue
    ) {
      recommendations.push({
        id: "cost-of-sales",
        priority: "critical",
        area: "costs",
        problem:
          "El costo de ventas supera los ingresos.",
        evidence: [
          `Ingresos: ${current.revenue}`,
          `Costo de ventas: ${current.costOfSales}`,
        ],
        action:
          "Revisar precios, costos unitarios, compras, desperdicios y margen por producto o servicio.",
        confidence: 0.96,
      });
    }

    const balanceDifference =
      current.assets -
      current.liabilities -
      current.equity;

    if (
      Math.abs(
        balanceDifference,
      ) > 0.01 &&
      current.assets > 0
    ) {
      recommendations.push({
        id: "balance-integrity",
        priority: "high",
        area: "data_quality",
        problem:
          "El balance disponible no cuadra.",
        evidence: [
          `Diferencia: ${round(
            balanceDifference,
          )}`,
        ],
        action:
          "Revisar activos, pasivos y patrimonio antes de usar el balance para decisiones de solvencia o valoración.",
        expectedImpact:
          "Aumentar la confiabilidad del diagnóstico.",
        confidence: 0.99,
      });
    }

    if (
      previous.revenue > 0
    ) {
      const change =
        ((current.revenue -
          previous.revenue) /
          Math.abs(
            previous.revenue,
          )) *
        100;

      if (change < -10) {
        recommendations.push({
          id: "revenue-decline",
          priority: "high",
          area: "revenue",
          problem:
            "Los ingresos disminuyeron frente al periodo de comparación.",
          evidence: [
            `Variación: ${round(
              change,
            )}%`,
          ],
          action:
            "Identificar si la caída proviene de volumen, precio, concentración, estacionalidad o canales.",
          confidence: 0.88,
        });
      }
    }

    if (
      quality.completeness < 70
    ) {
      recommendations.push({
        id: "data-completeness",
        priority: "high",
        area: "data_quality",
        problem:
          "La información financiera está incompleta.",
        evidence: [
          `Completitud estimada: ${quality.completeness}%`,
          ...quality.warnings.slice(
            0,
            3,
          ),
        ],
        action:
          "Completar los datos faltantes del cuestionario o documentación de respaldo antes de emitir conclusiones definitivas.",
        expectedImpact:
          "Aumentar la confiabilidad del análisis.",
        confidence: 0.99,
      });
    }

    return recommendations;
  }
}

export const financialAnalysisEngine =
  new FinancialAnalysisEngine();
