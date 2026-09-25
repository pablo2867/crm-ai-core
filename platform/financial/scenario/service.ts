import {
  financialAnalysisService,
} from "../analysis";

import type {
  FinancialScenarioRequest,
  FinancialScenarioResult,
} from "./types";

import {
  financialScenarioEngine,
} from "./engine";

export class FinancialScenarioService {
  async calculate(
    request: FinancialScenarioRequest,
  ): Promise<FinancialScenarioResult> {
    const analysis =
      await financialAnalysisService.analyze({
        context: request.context,
        analysisType: "full",
        periodId: request.periodId,
        classification:
          request.classification,
        includeStatements: true,
        includeCharts: false,
        includeRecommendations: false,
      });

    const baseRevenue =
      analysis.summary.revenue;

    const baseExpenses =
      analysis.summary.costOfSales +
      analysis.summary.operatingExpenses;

    return financialScenarioEngine.calculate(
      request,
      baseRevenue,
      baseExpenses,
    );
  }
}

export const financialScenarioService =
  new FinancialScenarioService();
