import type {
  FinancialDataServiceContract,
  FinancialPeriod,
  FinancialTransaction,
} from "../types";

import type {
  FinancialForecastRequest,
  FinancialForecastResult,
} from "./types";

import {
  FinancialForecastHistoricalPeriod,
  financialForecastEngine,
} from "./engine";

import { FinancialDataService } from "../service";

export class FinancialForecastService {
  constructor(
    private readonly dataService: FinancialDataServiceContract =
      new FinancialDataService(),
  ) {}

  async forecast(
    request: FinancialForecastRequest,
  ): Promise<FinancialForecastResult> {
    const periods =
      await this.dataService.getPeriods(
        request.context,
      );

    const orderedPeriods =
      this.orderPeriods(periods);

    const basePeriod =
      this.resolveBasePeriod(
        orderedPeriods,
        request.periodId,
      );

    const historicalPeriods =
      this.selectHistoricalPeriods(
        orderedPeriods,
        basePeriod,
      );

    const historicalData: FinancialForecastHistoricalPeriod[] =
      [];

    for (const period of historicalPeriods) {
      if (!period.id) {
        continue;
      }

      const transactions =
        await this.dataService.getTransactions(
          request.context,
          period.id,
        );

      const filteredTransactions =
        this.filterTransactions(
          transactions,
          request,
        );

      historicalData.push({
        periodId: period.id,
        revenue: this.sumByType(
          filteredTransactions,
          "revenue",
        ),
        expenses: this.sumByType(
          filteredTransactions,
          "expense",
        ),
      });
    }

    return financialForecastEngine.forecast(
      request,
      historicalData,
    );
  }

  private orderPeriods(
    periods: FinancialPeriod[],
  ): FinancialPeriod[] {
    return [...periods].sort(
      (a, b) =>
        a.startDate.localeCompare(b.startDate),
    );
  }

  private resolveBasePeriod(
    periods: FinancialPeriod[],
    periodId?: string,
  ): FinancialPeriod | undefined {
    if (periodId) {
      const period = periods.find(
        (item) => item.id === periodId,
      );

      if (!period) {
        throw new Error(
          `Financial period not found: ${periodId}`,
        );
      }

      return period;
    }

    return periods[periods.length - 1];
  }

  private selectHistoricalPeriods(
    periods: FinancialPeriod[],
    basePeriod?: FinancialPeriod,
  ): FinancialPeriod[] {
    if (!basePeriod) {
      return periods;
    }

    const baseIndex = periods.findIndex(
      (period) => period.id === basePeriod.id,
    );

    if (baseIndex <= 0) {
      return [basePeriod];
    }

    return periods.slice(0, baseIndex + 1);
  }

  private filterTransactions(
    transactions: FinancialTransaction[],
    request: FinancialForecastRequest,
  ): FinancialTransaction[] {
    return transactions.filter(
      (transaction) => {
        if (
          transaction.organizationId !==
            request.context.organizationId ||
          transaction.workspaceId !==
            request.context.workspaceId
        ) {
          return false;
        }

        if (
          request.classification &&
          transaction.classification !==
            request.classification
        ) {
          return false;
        }

        return true;
      },
    );
  }

  private sumByType(
    transactions: FinancialTransaction[],
    type: FinancialTransaction["type"],
  ): number {
    return transactions
      .filter(
        (transaction) =>
          transaction.type === type,
      )
      .reduce(
        (total, transaction) =>
          total + transaction.amount,
        0,
      );
  }
}

export const financialForecastService =
  new FinancialForecastService();
