import {
  financialAnalysisService,
} from "../analysis";

import type {
  FinancialSensitivityRequest,
  FinancialSensitivityResult,
} from "./types";

import { financialSensitivityEngine } from "./engine";

export class FinancialSensitivityService {
  async calculate(
    request: FinancialSensitivityRequest,
  ): Promise<FinancialSensitivityResult> {
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

    return financialSensitivityEngine.calculate(
      request,
      baseRevenue,
      baseExpenses,
    );
  }
}

export const financialSensitivityService =
  new FinancialSensitivityService();
