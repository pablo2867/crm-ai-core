import {
  FinancialDataService,
  type FinancialTransaction,
} from "../index";

import {
  financialRatiosEngine,
  type FinancialRatioRequest,
  type FinancialRatiosResult,
} from "./index";

export class FinancialRatiosService {
  constructor(
    private readonly dataService: FinancialDataService =
      new FinancialDataService(),
  ) {}

  async calculate(
    request: FinancialRatioRequest,
  ): Promise<FinancialRatiosResult> {
    const transactions: FinancialTransaction[] =
      await this.dataService.getTransactions(
        request.context,
        request.periodId,
      );

    const accounts =
      await this.dataService.getAccounts(
        request.context,
      );

    return financialRatiosEngine.calculate(
      request,
      transactions,
      accounts,
    );
  }
}

export const financialRatiosService =
  new FinancialRatiosService();