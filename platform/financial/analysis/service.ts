import {
  FinancialDataService,
  type FinancialTransaction,
} from "../index";

import {
  financialAnalysisEngine,
  type FinancialAnalysisRequest,
  type FinancialAnalysisResult,
} from "./index";

export class FinancialAnalysisService {
  constructor(
    private readonly dataService: FinancialDataService =
      new FinancialDataService(),
  ) {}

  async analyze(
    request: FinancialAnalysisRequest,
  ): Promise<FinancialAnalysisResult> {
    const transactions =
      await this.dataService.getTransactions(
        request.context,
        request.periodId,
      );

    const accounts =
      await this.dataService.getAccounts(
        request.context,
      );

    let comparisonTransactions: FinancialTransaction[] = [];

    if (request.comparePeriodId) {
      comparisonTransactions =
        await this.dataService.getTransactions(
          request.context,
          request.comparePeriodId,
        );
    }

    console.log(
      "[FINANCIAL VARIANCE TRACE]",
      JSON.stringify({
        analysisType: request.analysisType,
        periodId: request.periodId ?? null,
        comparePeriodId:
          request.comparePeriodId ?? null,
        currentTransactions:
          transactions.length,
        comparisonTransactions:
          comparisonTransactions.length,
        currentTypes:
          transactions.map((transaction) => transaction.type),
        comparisonTypes:
          comparisonTransactions.map(
            (transaction) => transaction.type,
          ),
      }),
    );

    return financialAnalysisEngine.analyze(
      request,
      transactions,
      accounts,
      comparisonTransactions,
    );
  }
}

export const financialAnalysisService =
  new FinancialAnalysisService();
