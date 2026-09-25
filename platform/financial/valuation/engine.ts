import type {
  FinancialValuationRequest,
  FinancialValuationResult,
} from "./types";

export class FinancialValuationEngine {
  calculate(
    request: FinancialValuationRequest,
  ): FinancialValuationResult {
    const warnings: string[] = [];

    let enterpriseValue = 0;

    switch (request.method) {
      case "dcf":
        enterpriseValue =
          this.calculateDCF(
            request,
            warnings,
          );
        break;

      case "revenue_multiple":
        enterpriseValue =
          this.calculateRevenueMultiple(
            request,
            warnings,
          );
        break;

      case "ebitda_multiple":
        enterpriseValue =
          this.calculateEbitdaMultiple(
            request,
            warnings,
          );
        break;
    }

    return {
      context: request.context,
      periodId: request.periodId,
      method: request.method,
      enterpriseValue,
      equityValue: null,
      assumptions: {
        discountRate:
          request.discountRate,
        terminalGrowthRate:
          request.terminalGrowthRate,
        revenueMultiple:
          request.revenueMultiple,
        ebitdaMultiple:
          request.ebitdaMultiple,
      },
      warnings,
    };
  }

  private calculateDCF(
    request: FinancialValuationRequest,
    warnings: string[],
  ): number {
    const cashFlows =
      this.normalizeCashFlows(
        request.cashFlows,
        warnings,
      );

    if (cashFlows.length === 0) {
      warnings.push(
        "DCF requires at least one valid cash flow.",
      );

      return 0;
    }

    const discountRate =
      this.normalizeRate(
        request.discountRate,
        0.1,
        "discount rate",
        warnings,
      );

    const terminalGrowthRate =
      this.normalizeRate(
        request.terminalGrowthRate,
        0.02,
        "terminal growth rate",
        warnings,
      );

    if (
      discountRate <= terminalGrowthRate
    ) {
      warnings.push(
        "Discount rate must be greater than terminal growth rate.",
      );

      return 0;
    }

    const presentValue =
      cashFlows.reduce(
        (total, cashFlow, index) =>
          total +
          cashFlow /
            Math.pow(
              1 + discountRate,
              index + 1,
            ),
        0,
      );

    const lastCashFlow =
      cashFlows[cashFlows.length - 1];

    const terminalValue =
      (lastCashFlow *
        (1 + terminalGrowthRate)) /
      (discountRate -
        terminalGrowthRate);

    const terminalPresentValue =
      terminalValue /
      Math.pow(
        1 + discountRate,
        cashFlows.length,
      );

    return (
      presentValue +
      terminalPresentValue
    );
  }

  private calculateRevenueMultiple(
    request: FinancialValuationRequest,
    warnings: string[],
  ): number {
    const revenue =
      this.normalizeValue(
        request.revenue,
        "revenue",
        warnings,
      );

    const multiple =
      this.normalizeMultiple(
        request.revenueMultiple,
        "revenue multiple",
        warnings,
      );

    if (revenue === null || multiple === null) {
      return 0;
    }

    return revenue * multiple;
  }

  private calculateEbitdaMultiple(
    request: FinancialValuationRequest,
    warnings: string[],
  ): number {
    const ebitda =
      this.normalizeValue(
        request.ebitda,
        "EBITDA",
        warnings,
      );

    const multiple =
      this.normalizeMultiple(
        request.ebitdaMultiple,
        "EBITDA multiple",
        warnings,
      );

    if (ebitda === null || multiple === null) {
      return 0;
    }

    return ebitda * multiple;
  }

  private normalizeCashFlows(
    values: number[] | undefined,
    warnings: string[],
  ): number[] {
    if (!Array.isArray(values)) {
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

  private normalizeRate(
    value: number | undefined,
    defaultValue: number,
    label: string,
    warnings: string[],
  ): number {
    const rate =
      value === undefined
        ? defaultValue
        : value;

    if (!Number.isFinite(rate)) {
      warnings.push(
        `Invalid ${label}; default value was used.`,
      );

      return defaultValue;
    }

    if (rate <= -1) {
      warnings.push(
        `Invalid ${label}; default value was used.`,
      );

      return defaultValue;
    }

    return rate;
  }

  private normalizeMultiple(
    value: number | undefined,
    label: string,
    warnings: string[],
  ): number | null {
    if (
      value === undefined ||
      !Number.isFinite(value) ||
      value < 0
    ) {
      warnings.push(
        `A valid ${label} greater than or equal to zero is required.`,
      );

      return null;
    }

    return value;
  }

  private normalizeValue(
    value: number | undefined,
    label: string,
    warnings: string[],
  ): number | null {
    if (
      value === undefined ||
      !Number.isFinite(value)
    ) {
      warnings.push(
        `A valid ${label} value is required.`,
      );

      return null;
    }

    return value;
  }
}

export const financialValuationEngine =
  new FinancialValuationEngine();
