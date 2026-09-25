import type {
  FinancialTransaction,
} from "../types";

import type {
  FinancialForecastMethod,
  FinancialForecastPeriod,
  FinancialForecastRequest,
  FinancialForecastResult,
} from "./types";

export interface FinancialForecastHistoricalPeriod {
  periodId?: string;
  revenue: number;
  expenses: number;
}

export class FinancialForecastEngine {
  forecast(
    request: FinancialForecastRequest,
    historicalPeriods: FinancialForecastHistoricalPeriod[],
  ): FinancialForecastResult {
    const periods = this.buildForecast(
      historicalPeriods,
      request.periods,
      request.method,
    );

    return {
      context: request.context,
      basePeriodId: request.periodId,
      method: request.method,
      periods,
    };
  }

  private buildForecast(
    historicalPeriods: FinancialForecastHistoricalPeriod[],
    forecastPeriods: number,
    method: FinancialForecastMethod,
  ): FinancialForecastPeriod[] {
    if (forecastPeriods <= 0) {
      return [];
    }

    const history = historicalPeriods.filter(
      (period) =>
        Number.isFinite(period.revenue) &&
        Number.isFinite(period.expenses),
    );

    if (history.length === 0) {
      return Array.from(
        { length: forecastPeriods },
        (_, index) => ({
          period: index + 1,
          revenue: 0,
          expenses: 0,
          profit: 0,
        }),
      );
    }

    const revenueHistory = history.map(
      (period) => period.revenue,
    );

    const expenseHistory = history.map(
      (period) => period.expenses,
    );

    switch (method) {
      case "historical_average":
        return this.forecastFromAverage(
          revenueHistory,
          expenseHistory,
          forecastPeriods,
        );

      case "growth_rate":
        return this.forecastFromGrowthRate(
          revenueHistory,
          expenseHistory,
          forecastPeriods,
        );

      case "trend":
        return this.forecastFromTrend(
          revenueHistory,
          expenseHistory,
          forecastPeriods,
        );
    }
  }

  private forecastFromAverage(
    revenueHistory: number[],
    expenseHistory: number[],
    forecastPeriods: number,
  ): FinancialForecastPeriod[] {
    const revenue =
      this.average(revenueHistory);

    const expenses =
      this.average(expenseHistory);

    return Array.from(
      { length: forecastPeriods },
      (_, index) => ({
        period: index + 1,
        revenue,
        expenses,
        profit: revenue - expenses,
      }),
    );
  }

  private forecastFromGrowthRate(
    revenueHistory: number[],
    expenseHistory: number[],
    forecastPeriods: number,
  ): FinancialForecastPeriod[] {
    const revenueGrowth =
      this.averageGrowthRate(revenueHistory);

    const expenseGrowth =
      this.averageGrowthRate(expenseHistory);

    const baseRevenue =
      revenueHistory[revenueHistory.length - 1] ?? 0;

    const baseExpenses =
      expenseHistory[expenseHistory.length - 1] ?? 0;

    return Array.from(
      { length: forecastPeriods },
      (_, index) => {
        const period = index + 1;

        const revenue =
          baseRevenue *
          Math.pow(1 + revenueGrowth, period);

        const expenses =
          baseExpenses *
          Math.pow(1 + expenseGrowth, period);

        return {
          period,
          revenue,
          expenses,
          profit: revenue - expenses,
        };
      },
    );
  }

  private forecastFromTrend(
    revenueHistory: number[],
    expenseHistory: number[],
    forecastPeriods: number,
  ): FinancialForecastPeriod[] {
    const revenueTrend =
      this.linearTrend(revenueHistory);

    const expenseTrend =
      this.linearTrend(expenseHistory);

    return Array.from(
      { length: forecastPeriods },
      (_, index) => {
        const period =
          revenueHistory.length + index + 1;

        const revenue = Math.max(
          0,
          this.predictLinear(
            revenueTrend.slope,
            revenueTrend.intercept,
            period,
          ),
        );

        const expenses = Math.max(
          0,
          this.predictLinear(
            expenseTrend.slope,
            expenseTrend.intercept,
            period,
          ),
        );

        return {
          period: index + 1,
          revenue,
          expenses,
          profit: revenue - expenses,
        };
      },
    );
  }

  private average(values: number[]): number {
    if (values.length === 0) {
      return 0;
    }

    return (
      values.reduce(
        (total, value) => total + value,
        0,
      ) / values.length
    );
  }

  private averageGrowthRate(
    values: number[],
  ): number {
    const growthRates: number[] = [];

    for (let index = 1; index < values.length; index++) {
      const previous = values[index - 1];
      const current = values[index];

      if (
        previous !== 0 &&
        Number.isFinite(previous) &&
        Number.isFinite(current)
      ) {
        growthRates.push(
          (current - previous) / Math.abs(previous),
        );
      }
    }

    return this.average(growthRates);
  }

  private linearTrend(values: number[]): {
    slope: number;
    intercept: number;
  } {
    if (values.length === 1) {
      return {
        slope: 0,
        intercept: values[0],
      };
    }

    const n = values.length;

    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumXX = 0;

    values.forEach((value, index) => {
      const x = index + 1;

      sumX += x;
      sumY += value;
      sumXY += x * value;
      sumXX += x * x;
    });

    const denominator =
      n * sumXX - sumX * sumX;

    if (denominator === 0) {
      return {
        slope: 0,
        intercept: this.average(values),
      };
    }

    const slope =
      (n * sumXY - sumX * sumY) /
      denominator;

    const intercept =
      (sumY - slope * sumX) / n;

    return {
      slope,
      intercept,
    };
  }

  private predictLinear(
    slope: number,
    intercept: number,
    period: number,
  ): number {
    return slope * period + intercept;
  }
}

export const financialForecastEngine =
  new FinancialForecastEngine();
