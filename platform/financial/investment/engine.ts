import type {
  FinancialInvestmentRequest,
  FinancialInvestmentResult,
} from "./types";

export class FinancialInvestmentEngine {
  calculate(
    request: FinancialInvestmentRequest,
  ): FinancialInvestmentResult {
    const warnings: string[] = [];

    const initialInvestment =
      this.normalizeInitialInvestment(
        request.initialInvestment,
        warnings,
      );

    const cashFlows =
      this.normalizeCashFlows(
        request.cashFlows,
        warnings,
      );

    const discountRate =
      this.normalizeDiscountRate(
        request.discountRate,
        warnings,
      );

    const totalCashFlow =
      cashFlows.reduce(
        (total, cashFlow) =>
          total + cashFlow,
        0,
      );

    const roi =
      initialInvestment === 0
        ? 0
        : ((totalCashFlow -
              initialInvestment) /
            initialInvestment) *
          100;

    const npv =
      cashFlows.reduce(
        (total, cashFlow, index) =>
          total +
          cashFlow /
            Math.pow(
              1 + discountRate,
              index + 1,
            ),
        -initialInvestment,
      );

    const paybackPeriod =
      this.calculatePaybackPeriod(
        initialInvestment,
        cashFlows,
      );

    return {
      context: request.context,
      periodId: request.periodId,
      initialInvestment,
      totalCashFlow,
      roi,
      npv,
      paybackPeriod,
      warnings,
    };
  }

  private normalizeInitialInvestment(
    value: number,
    warnings: string[],
  ): number {
    if (!Number.isFinite(value)) {
      warnings.push(
        "Invalid initial investment was replaced with zero.",
      );

      return 0;
    }

    if (value < 0) {
      warnings.push(
        "Negative initial investment was replaced with zero.",
      );

      return 0;
    }

    return value;
  }

  private normalizeCashFlows(
    values: number[],
    warnings: string[],
  ): number[] {
    if (!Array.isArray(values)) {
      warnings.push(
        "Invalid cash flow series was replaced with an empty series.",
      );

      return [];
    }

    return values.flatMap((value) => {
      if (!Number.isFinite(value)) {
        warnings.push(
          `Invalid cash flow was ignored: ${value}.`,
        );

        return [];
      }

      return [value];
    });
  }

  private normalizeDiscountRate(
    value: number | undefined,
    warnings: string[],
  ): number {
    const rate = value ?? 0;

    if (!Number.isFinite(rate)) {
      warnings.push(
        "Invalid discount rate was replaced with zero.",
      );

      return 0;
    }

    if (rate <= -1) {
      warnings.push(
        "Discount rate must be greater than -100%; zero was used.",
      );

      return 0;
    }

    return rate;
  }

  private calculatePaybackPeriod(
    initialInvestment: number,
    cashFlows: number[],
  ): number | null {
    if (initialInvestment === 0) {
      return 0;
    }

    let cumulativeCashFlow =
      -initialInvestment;

    for (
      let index = 0;
      index < cashFlows.length;
      index++
    ) {
      const previousCumulative =
        cumulativeCashFlow;

      cumulativeCashFlow +=
        cashFlows[index];

      if (cumulativeCashFlow >= 0) {
        const cashFlow =
          cashFlows[index];

        if (cashFlow <= 0) {
          return index + 1;
        }

        const remaining =
          -previousCumulative;

        return (
          index +
          remaining / cashFlow
        );
      }
    }

    return null;
  }
}

export const financialInvestmentEngine =
  new FinancialInvestmentEngine();
