import type {
  FinancialSensitivityRequest,
  FinancialSensitivityResult,
} from "./types";

export class FinancialSensitivityEngine {
  calculate(
    request: FinancialSensitivityRequest,
    baseRevenue: number,
    baseExpenses: number,
  ): FinancialSensitivityResult {
    const warnings: string[] = [];

    const normalizedRevenue =
      this.normalizeBaseValue(
        baseRevenue,
        "revenue",
        warnings,
      );

    const normalizedExpenses =
      this.normalizeBaseValue(
        baseExpenses,
        "expenses",
        warnings,
      );

    const rows = request.variable.values.flatMap(
      (value) => {
        if (!Number.isFinite(value)) {
          warnings.push(
            `Invalid sensitivity value was ignored: ${value}.`,
          );
          return [];
        }

        const multiplier = 1 + value / 100;

        if (
          !Number.isFinite(multiplier) ||
          multiplier < 0
        ) {
          warnings.push(
            `Invalid sensitivity value was ignored: ${value}.`,
          );
          return [];
        }

        let revenue = normalizedRevenue;
        let expenses = normalizedExpenses;

        if (
          request.variable.metric ===
          "revenue"
        ) {
          revenue *= multiplier;
        }

        if (
          request.variable.metric ===
          "expenses"
        ) {
          expenses *= multiplier;
        }

        return [
          {
            value,
            revenue,
            expenses,
            profit: revenue - expenses,
          },
        ];
      },
    );

    return {
      context: request.context,
      periodId: request.periodId,
      variable: request.variable,
      baseRevenue: normalizedRevenue,
      baseExpenses: normalizedExpenses,
      baseProfit:
        normalizedRevenue - normalizedExpenses,
      rows,
      warnings,
    };
  }

  private normalizeBaseValue(
    value: number,
    metric: "revenue" | "expenses",
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

export const financialSensitivityEngine =
  new FinancialSensitivityEngine();
