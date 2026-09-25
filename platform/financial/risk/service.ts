import type {
  FinancialDataServiceContract,
} from "../types";

import {
  financialAnalysisService,
} from "../analysis";

import {
  financialRatiosService,
} from "../ratios";

import type {
  FinancialRiskRequest,
  FinancialRiskResult,
} from "./types";

import { FinancialDataService } from "../service";
import { financialRiskEngine } from "./engine";

export class FinancialRiskService {
  constructor(
    private readonly dataService: FinancialDataServiceContract =
      new FinancialDataService(),
  ) {}

  async calculate(
    request: FinancialRiskRequest,
  ): Promise<FinancialRiskResult> {
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

    const ratios =
      await financialRatiosService.calculate({
        context: request.context,
        periodId: request.periodId,
        classification:
          request.classification,
      });

    return financialRiskEngine.calculate(
      request,
      analysis,
      ratios,
    );
  }
}

export const financialRiskService =
  new FinancialRiskService();
