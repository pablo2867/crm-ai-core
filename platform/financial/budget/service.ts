import type {
  FinancialDataServiceContract,
} from "../types";

import type {
  FinancialBudgetRequest,
  FinancialBudgetResult,
} from "./types";

import { FinancialDataService } from "../service";
import { financialBudgetEngine } from "./engine";

export class FinancialBudgetService {
  constructor(
    private readonly dataService: FinancialDataServiceContract =
      new FinancialDataService(),
  ) {}

  async calculate(
    request: FinancialBudgetRequest,
  ): Promise<FinancialBudgetResult> {
    if (request.periodId) {
      const periods =
        await this.dataService.getPeriods(
          request.context,
        );

      const periodExists = periods.some(
        (period) => period.id === request.periodId,
      );

      if (!periodExists) {
        throw new Error(
          `Financial period not found: ${request.periodId}`,
        );
      }
    }

    return financialBudgetEngine.calculate(
      request,
    );
  }
}

export const financialBudgetService =
  new FinancialBudgetService();