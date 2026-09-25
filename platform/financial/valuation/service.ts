import type {
  FinancialDataServiceContract,
} from "../types";

import type {
  FinancialValuationRequest,
  FinancialValuationResult,
} from "./types";

import { FinancialDataService } from "../service";
import { financialValuationEngine } from "./engine";

export class FinancialValuationService {
  constructor(
    private readonly dataService: FinancialDataServiceContract =
      new FinancialDataService(),
  ) {}

  async calculate(
    request: FinancialValuationRequest,
  ): Promise<FinancialValuationResult> {
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

    return financialValuationEngine.calculate(
      request,
    );
  }
}

export const financialValuationService =
  new FinancialValuationService();
