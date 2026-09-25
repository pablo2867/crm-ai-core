import type {
  FinancialDataServiceContract,
} from "../types";

import {
  financialAnalysisService,
} from "../analysis";

import type {
  FinancialAnalysisType,
} from "../analysis";

import {
  financialRiskService,
} from "../risk";

import type {
  FinancialExecutiveReportRequest,
  FinancialExecutiveReportResult,
} from "./types";

import { FinancialDataService } from "../service";
import { financialExecutiveReportsEngine } from "./engine";

export class FinancialExecutiveReportsService {
  constructor(
    private readonly dataService: FinancialDataServiceContract =
      new FinancialDataService(),
  ) {}

  async generate(
    request: FinancialExecutiveReportRequest,
  ): Promise<FinancialExecutiveReportResult> {
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

    const analysisType: FinancialAnalysisType =
      "full";

    const analysis =
      await financialAnalysisService.analyze({
        context: request.context,
        analysisType,
        periodId: request.periodId,
        includeStatements: true,
        includeCharts: true,
        includeRecommendations: true,
      });

    const risk =
      request.type === "risk"
        ? await financialRiskService.calculate({
            context: request.context,
            periodId: request.periodId,
          })
        : undefined;

    return financialExecutiveReportsEngine.generate(
      request,
      analysis,
      risk,
    );
  }
}

export const financialExecutiveReportsService =
  new FinancialExecutiveReportsService();
