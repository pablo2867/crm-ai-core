import type {
  FinancialDataServiceContract,
} from "../types";

import type {
  FinancialInvestmentRequest,
  FinancialInvestmentResult,
} from "./types";

import { FinancialDataService } from "../service";
import { financialInvestmentEngine } from "./engine";

export class FinancialInvestmentService {
  constructor(
    private readonly dataService: FinancialDataServiceContract =
      new FinancialDataService(),
  ) {}

  async calculate(
    request: FinancialInvestmentRequest,
  ): Promise<FinancialInvestmentResult> {
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

    return financialInvestmentEngine.calculate(
      request,
    );
  }
}

export const financialInvestmentService =
  new FinancialInvestmentService();
