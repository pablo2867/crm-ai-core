import type {
  FinancialScenarioAdjustment,
  FinancialScenarioRequest,
  FinancialScenarioResult,
} from "./types";

export class FinancialScenarioEngine {
  calculate(
    request: FinancialScenarioRequest,
    baseRevenue: number,
    baseExpenses: number,
  ): FinancialScenarioResult {
    const warnings: string[] = [];

    let scenarioRevenue = this.normalizeBaseValue(
      baseRevenue,
      "revenue",
      warnings,
    );

    let scenarioExpenses = this.normalizeBaseValue(
      baseExpenses,
      "expenses",
      warnings,
    );

    for (const adjustment of request.adjustments) {
      if (!Number.isFinite(adjustment.percentage)) {
        warnings.push(
          `Invalid ${adjustment.metric} adjustment was ignored.`,
        );
        continue;
      }

      const multiplier =
        1 + adjustment.percentage / 100;

      if (!Number.isFinite(multiplier) || multiplier < 0) {
        warnings.push(
          `Invalid ${adjustment.metric} adjustment was ignored.`,
        );
        continue;
      }

      if (adjustment.metric === "revenue") {
        scenarioRevenue *= multiplier;
      }

      if (adjustment.metric === "expenses") {
        scenarioExpenses *= multiplier;
      }
    }

    const baseProfit =
      baseRevenue - baseExpenses;

    const scenarioProfit =
      scenarioRevenue - scenarioExpenses;

    return {
      context: request.context,
      periodId: request.periodId,
      type: request.type,
      baseRevenue,
      baseExpenses,
      scenarioRevenue,
      scenarioExpenses,
      baseProfit,
      scenarioProfit,
      revenueChange:
        scenarioRevenue - baseRevenue,
      expenseChange:
        scenarioExpenses - baseExpenses,
      profitChange:
        scenarioProfit - baseProfit,
      adjustments:
        request.adjustments,
      warnings,
    };
  }

  private normalizeBaseValue(
    value: number,
    metric: FinancialScenarioAdjustment["metric"],
    warnings: string[],
  ): number {
    if (!Number.isFinite(value)) {
      warnings.push(
        `Invalid base ${metric} value was replaced with zero.`,
      );

      return 0;
    }

    return value;
  }
}

export const financialScenarioEngine =
  new FinancialScenarioEngine();
