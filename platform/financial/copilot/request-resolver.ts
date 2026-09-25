import type {
  FinancialCopilotIntent,
  FinancialCopilotRequest,
} from "./types";

import type {
  FinancialAnalysisType,
} from "../analysis";

import type {
  FinancialForecastMethod,
} from "../forecast";

import type {
  FinancialScenarioType,
  FinancialScenarioAdjustment,
} from "../scenario";

import type {
  FinancialSensitivityMetric,
} from "../sensitivity";

import type {
  FinancialExecutiveReportType,
} from "../reports";

import type {
  FinancialValuationMethod,
} from "../valuation";

export interface FinancialCopilotResolvedParameters {
  analysisType?: FinancialAnalysisType;
  comparePeriodId?: string;

  ratioTypes?: string[];

  forecastPeriods?: number;
  forecastMethod?: FinancialForecastMethod;

  budgetLines?: unknown[];

  scenarioType?: FinancialScenarioType;
  scenarioAdjustments?: FinancialScenarioAdjustment[];

  sensitivityRevenue?: number;
  sensitivityExpenses?: number;
  sensitivityMetric?: FinancialSensitivityMetric;
  sensitivityValues?: number[];

  initialInvestment?: number;
  cashFlows?: number[];
  discountRate?: number;

  revenue?: number;
  expenses?: number;
  liabilities?: number;
  assets?: number;

  valuationMethod?: FinancialValuationMethod;
  ebitda?: number;
  terminalGrowthRate?: number;
  revenueMultiple?: number;
  ebitdaMultiple?: number;

  reportType?: FinancialExecutiveReportType;
}

export class FinancialCopilotRequestResolver {
  resolve(
    request: FinancialCopilotRequest,
    intent: FinancialCopilotIntent,
  ): FinancialCopilotResolvedParameters {
    const context =
      request.context as unknown as Record<
        string,
        unknown
      >;

    const contextAnalysisType =
      this.readString(
        context.analysisType,
      ) as FinancialAnalysisType | undefined;

    const analysisType =
      contextAnalysisType ??
      (
        intent === "analysis"
          ? this.resolveAnalysisType(
              request.message,
            )
          : undefined
      );

    return {
      analysisType,

      comparePeriodId:
        this.readString(
          context.comparePeriodId,
        ),

      ratioTypes:
        this.readStringArray(
          context.ratioTypes,
        ),

      forecastPeriods:
        this.readNumber(
          context.forecastPeriods,
        ),

      forecastMethod:
        this.readString(
          context.forecastMethod,
        ) as FinancialForecastMethod | undefined,

      budgetLines:
        this.readArray(
          context.budgetLines,
        ),

      scenarioType:
        this.readString(
          context.scenarioType,
        ) as FinancialScenarioType | undefined,

      scenarioAdjustments:
        this.readScenarioAdjustments(
          context.scenarioAdjustments,
        ),

      sensitivityRevenue:
        this.readNumber(
          context.sensitivityRevenue,
        ),

      sensitivityExpenses:
        this.readNumber(
          context.sensitivityExpenses,
        ),

      sensitivityMetric:
        this.readString(
          context.sensitivityMetric,
        ) as FinancialSensitivityMetric | undefined,

      sensitivityValues:
        this.readNumberArray(
          context.sensitivityValues,
        ),

      initialInvestment:
        this.readNumber(
          context.initialInvestment,
        ),

      cashFlows:
        this.readNumberArray(
          context.cashFlows,
        ),

      discountRate:
        this.readNumber(
          context.discountRate,
        ),

      revenue:
        this.readNumber(
          context.revenue,
        ),

      expenses:
        this.readNumber(
          context.expenses,
        ),

      liabilities:
        this.readNumber(
          context.liabilities,
        ),

      assets:
        this.readNumber(
          context.assets,
        ),

      valuationMethod:
        this.readString(
          context.valuationMethod,
        ) as FinancialValuationMethod | undefined,

      ebitda:
        this.readNumber(
          context.ebitda,
        ),

      terminalGrowthRate:
        this.readNumber(
          context.terminalGrowthRate,
        ),

      revenueMultiple:
        this.readNumber(
          context.revenueMultiple,
        ),

      ebitdaMultiple:
        this.readNumber(
          context.ebitdaMultiple,
        ),

      reportType:
        this.readString(
          context.reportType,
        ) as FinancialExecutiveReportType | undefined,
    };
  }

  private resolveAnalysisType(
    message: string,
  ): FinancialAnalysisType {
    const text =
      message.toLowerCase();

    /*
     * Specific financial analysis concepts
     * must be resolved before individual
     * metric keywords to avoid semantic
     * collisions.
     */

    if (
      text.includes("flujo de efectivo") ||
      text.includes("flujo de caja") ||
      text.includes("cash flow") ||
      text.includes("cashflow")
    ) {
      return "cash_flow";
    }

    if (
      text.includes("tendencia") ||
      text.includes("tendencias") ||
      text.includes("tendencia de") ||
      text.includes("tendencias de") ||
      text.includes("trend") ||
      text.includes("trends")
    ) {
      return "trends";
    }

    if (
      text.includes("variación") ||
      text.includes("variacion") ||
      text.includes("variance") ||
      text.includes("vs") ||
      text.includes("comparado")
    ) {
      return "variance";
    }

    if (
      text.includes("rentabilidad") ||
      text.includes("margen") ||
      text.includes("profit") ||
      text.includes("profitability")
    ) {
      return "profitability";
    }

    if (
      text.includes("gasto") ||
      text.includes("gastos") ||
      text.includes("expense") ||
      text.includes("expenses")
    ) {
      return "expenses";
    }

    return "revenue";
  }

  private readString(
    value: unknown,
  ): string | undefined {
    return typeof value === "string"
      ? value
      : undefined;
  }

  private readNumber(
    value: unknown,
  ): number | undefined {
    return typeof value === "number" &&
      Number.isFinite(value)
      ? value
      : undefined;
  }

  private readArray(
    value: unknown,
  ): unknown[] | undefined {
    return Array.isArray(value)
      ? value
      : undefined;
  }

  private readStringArray(
    value: unknown,
  ): string[] | undefined {
    if (!Array.isArray(value)) {
      return undefined;
    }

    const values = value.filter(
      (item): item is string =>
        typeof item === "string",
    );

    return values.length > 0
      ? values
      : undefined;
  }

  private readNumberArray(
    value: unknown,
  ): number[] | undefined {
    if (!Array.isArray(value)) {
      return undefined;
    }

    const values = value.filter(
      (item): item is number =>
        typeof item === "number" &&
        Number.isFinite(item),
    );

    return values.length > 0
      ? values
      : undefined;
  }

  private readScenarioAdjustments(
    value: unknown,
  ): FinancialScenarioAdjustment[] | undefined {
    if (!Array.isArray(value)) {
      return undefined;
    }

    const adjustments =
      value.filter(
        (
          item,
        ): item is FinancialScenarioAdjustment => {
          if (
            typeof item !== "object" ||
            item === null
          ) {
            return false;
          }

          const candidate = item as {
            metric?: unknown;
            percentage?: unknown;
          };

          return (
            (
              candidate.metric === "revenue" ||
              candidate.metric === "expenses"
            ) &&
            typeof candidate.percentage === "number" &&
            Number.isFinite(
              candidate.percentage,
            )
          );
        },
      );

    return adjustments.length > 0
      ? adjustments
      : undefined;
  }
}

export const financialCopilotRequestResolver =
  new FinancialCopilotRequestResolver();