import { routeCopilotRequest } from "./router";
import { runtimeEngine } from "@/platform/runtime";
import type { CopilotHandledResponse } from "./types";

interface WorkflowChatResult {
  data?: {
    answer?: unknown;
    intent?: unknown;
    data?: unknown;
  };
}

interface FinancialMetric {
  name?: unknown;
  value?: unknown;
  unit?: unknown;
  currency?: unknown;
}

interface FinancialTrend {
  metric?: unknown;
  currentValue?: unknown;
  previousValue?: unknown;
  change?: unknown;
  changePercentage?: unknown;
  direction?: unknown;
}

interface FinancialVariance {
  metric?: unknown;
  actual?: unknown;
  reference?: unknown;
  variance?: unknown;
  variancePercentage?: unknown;
}

interface FinancialResultData {
  analysisType?: unknown;
  metrics?: unknown;
  trends?: unknown;
  variances?: unknown;
}

function extractWorkflowAnswer(
  results: unknown,
): string | undefined {
  if (!Array.isArray(results)) {
    return undefined;
  }

  for (const item of results) {
    if (
      typeof item !== "object" ||
      item === null
    ) {
      continue;
    }

    const result =
      item as WorkflowChatResult;

    const answer =
      result.data?.answer;

    if (
      typeof answer === "string" &&
      answer.trim()
    ) {
      return answer.trim();
    }
  }

  return undefined;
}

function extractFinancialAnswer(
  results: unknown,
): string | undefined {
  if (!Array.isArray(results)) {
    return undefined;
  }

  for (const item of results) {
    if (
      typeof item !== "object" ||
      item === null
    ) {
      continue;
    }

    const result =
      item as WorkflowChatResult;

    const capabilityData =
      result.data?.data;

    if (
      typeof capabilityData !== "object" ||
      capabilityData === null
    ) {
      continue;
    }

    const financialResult =
      capabilityData as FinancialResultData;

    const analysisType =
      typeof financialResult.analysisType ===
      "string"
        ? financialResult.analysisType
        : "revenue";

    if (
      analysisType === "trends" &&
      Array.isArray(
        financialResult.trends,
      )
    ) {
      const trends =
        financialResult.trends as FinancialTrend[];

      const validTrends =
        trends.filter(
          (trend) =>
            typeof trend === "object" &&
            trend !== null &&
            typeof trend.metric === "string" &&
            typeof trend.currentValue === "number" &&
            typeof trend.previousValue === "number" &&
            typeof trend.changePercentage === "number" &&
            typeof trend.direction === "string",
        );

      if (validTrends.length > 0) {
        const currency =
          Array.isArray(
            financialResult.metrics,
          )
            ? financialResult.metrics.find(
                (metric) =>
                  typeof metric === "object" &&
                  metric !== null &&
                  typeof
                    (metric as FinancialMetric)
                      .currency === "string",
              ) as FinancialMetric | undefined
            : undefined;

        const currencyCode =
          typeof currency?.currency ===
          "string"
            ? currency.currency
            : "";

        const formatValue = (
          value: number,
        ) =>
          new Intl.NumberFormat(
            "es-MX",
            {
              maximumFractionDigits: 2,
            },
          ).format(value);

        const trendLabels: Record<
          string,
          string
        > = {
          revenue: "ingresos",
          expenses: "gastos",
        };

        const trendMessages =
          validTrends.map(
            (trend) => {
              const metric =
                trend.metric as string;

              const label =
                trendLabels[metric] ??
                metric;

              const direction =
                trend.direction as string;

              const directionText =
                direction === "up"
                  ? "aumentaron"
                  : direction === "down"
                    ? "disminuyeron"
                    : "se mantuvieron estables";

              const changePercentage =
                formatValue(
                  Math.abs(
                    trend.changePercentage as number,
                  ),
                );

              return `${label} ${directionText} ${changePercentage}%`;
            },
          );

        const suffix =
          currencyCode
            ? ` ${currencyCode}`
            : "";

        return `La tendencia actual muestra que ${trendMessages.join(" y ")}. Los valores actuales son: ${validTrends
          .map(
            (trend) => {
              const metric =
                trend.metric as string;

              const label =
                trendLabels[metric] ??
                metric;

              return `${label} $${formatValue(
                trend.currentValue as number,
              )}${suffix}`;
            },
          )
          .join(" y ")}.`;
      }
    }

    if (
      analysisType === "variance" &&
      Array.isArray(
        financialResult.variances,
      )
    ) {
      const variances =
        financialResult.variances as FinancialVariance[];

      const validVariances =
        variances.filter(
          (variance) =>
            typeof variance === "object" &&
            variance !== null &&
            typeof variance.metric === "string" &&
            typeof variance.actual === "number" &&
            typeof variance.reference === "number" &&
            typeof variance.variance === "number" &&
            typeof variance.variancePercentage === "number",
        );

      if (validVariances.length > 0) {
        const formatValue = (
          value: number,
        ) =>
          new Intl.NumberFormat(
            "es-MX",
            {
              maximumFractionDigits: 2,
            },
          ).format(value);

        const varianceLabels: Record<
          string,
          string
        > = {
          revenue: "ingresos",
          expenses: "gastos",
        };

        const messages =
          validVariances.map(
            (variance) => {
              const metric =
                variance.metric as string;

              const label =
                varianceLabels[metric] ??
                metric;

              const percentage =
                variance.variancePercentage as number;

              const direction =
                percentage > 0
                  ? "aumentaron"
                  : percentage < 0
                    ? "disminuyeron"
                    : "no cambiaron";

              return `${label} ${direction} ${formatValue(
                Math.abs(percentage),
              )}%`;
            },
          );

        return `La variación actual muestra que ${messages.join(" y ")}.`;
      }
    }

    if (
      !Array.isArray(
        financialResult.metrics,
      )
    ) {
      continue;
    }

    const metricNames: Record<
      string,
      string[]
    > = {
      revenue: ["revenue"],
      expenses: ["expenses"],
      profitability: ["profit"],
      cash_flow: [
        "net_cash_flow",
        "cash_flow",
      ],
      trends: ["revenue"],
      variance: ["revenue"],
    };

    const targetMetrics =
      metricNames[analysisType] ??
      [analysisType];

    for (
      const metric of financialResult.metrics
    ) {
      if (
        typeof metric !== "object" ||
        metric === null
      ) {
        continue;
      }

      const financialMetric =
        metric as FinancialMetric;

      if (
        typeof financialMetric.name !==
        "string"
      ) {
        continue;
      }

      if (
        !targetMetrics.includes(
          financialMetric.name,
        )
      ) {
        continue;
      }

      if (
        typeof financialMetric.value !==
        "number"
      ) {
        continue;
      }

      const formattedValue =
        new Intl.NumberFormat(
          "es-MX",
          {
            maximumFractionDigits: 2,
          },
        ).format(
          financialMetric.value,
        );

      const currency =
        typeof financialMetric.currency ===
        "string"
          ? financialMetric.currency
          : "";

      const labels: Record<
        string,
        string
      > = {
        revenue:
          "El revenue actual es",

        expenses:
          "Los gastos actuales son",

        profitability:
          "La utilidad actual es",

        cash_flow:
          "El flujo de efectivo actual es",

        trends:
          "La tendencia financiera actual muestra",

        variance:
          "La variación financiera actual es",
      };

      const label =
        labels[analysisType] ??
        "El resultado financiero es";

      return currency
        ? `${label} $${formattedValue} ${currency}.`
        : `${label} $${formattedValue}.`;
    }
  }

  return undefined;
}

function extractWorkflowResponse(
  results: unknown,
): string | undefined {
  return (
    extractWorkflowAnswer(results) ??
    extractFinancialAnswer(results)
  );
}

export class CopilotController {
  async handle(
    question: string,
    input: Record<string, unknown> = {},
  ): Promise<CopilotHandledResponse> {
    const routed =
      await routeCopilotRequest(
        question,
        input,
      );

    if (
      routed.handled &&
      routed.result
    ) {
      const runtime =
        routed.result;

      const answer =
        extractWorkflowResponse(
          runtime.workflow?.results,
        );

      return {
        handled: true,
        result: {
          success: runtime.success,
          answer:
            answer ??
            runtime.summary,
          runtime,
          decision:
            runtime.decision,
          workflow:
            runtime.workflow,
          plan:
            runtime.plan,
          validation:
            runtime.validation,
          explanation:
            runtime.explanation,
        },
      };
    }

    const runtime =
      await runtimeEngine.execute({
        message: question,
        intent: "copilot",
        userId:
          typeof input.userId ===
          "string"
            ? input.userId
            : undefined,

        leadId:
          typeof input.leadId ===
          "number"
            ? input.leadId
            : undefined,

        organizationId:
          typeof input.organizationId ===
          "string"
            ? input.organizationId
            : undefined,

        workspaceId:
          typeof input.workspaceId ===
          "string"
            ? input.workspaceId
            : undefined,

        moduleId:
          typeof input.moduleId ===
          "string"
            ? input.moduleId
            : undefined,

        context: input,
      });

    if (runtime.success) {
      const answer =
        extractWorkflowResponse(
          runtime.workflow?.results,
        );

      return {
        handled: true,
        result: {
          success: true,
          answer:
            answer ??
            runtime.summary,
          runtime,
          decision:
            runtime.decision,
          workflow:
            runtime.workflow,
          plan:
            runtime.plan,
          validation:
            runtime.validation,
          explanation:
            runtime.explanation,
        },
      };
    }

    return {
      handled: false,
    };
  }
}

export const copilotController =
  new CopilotController();
