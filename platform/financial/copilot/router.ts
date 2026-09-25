import type {
  FinancialCopilotIntent,
  FinancialCopilotRequest,
} from "./types";

import {
  financialCopilotRequestResolver,
} from "./request-resolver";

import {
  FinancialDataService,
} from "../index";

import { financialAnalysisService } from "../analysis";
import { financialRatiosService } from "../ratios";
import { financialForecastService } from "../forecast";
import { financialBudgetService } from "../budget";
import { financialScenarioService } from "../scenario";
import { financialSensitivityService } from "../sensitivity";
import { financialInvestmentService } from "../investment";
import { financialRiskService } from "../risk";
import { financialValuationService } from "../valuation";
import { financialExecutiveReportsService } from "../reports";

export class FinancialCopilotRouter {
  private readonly dataService =
    new FinancialDataService();

  async route(
    request: FinancialCopilotRequest,
    intent: FinancialCopilotIntent,
  ): Promise<unknown> {
    const parameters =
      financialCopilotRequestResolver.resolve(
        request,
        intent,
      );

    switch (intent) {
      case "analysis": {
        let periodId = request.periodId;
        let comparePeriodId =
          parameters.comparePeriodId;

        if (
          parameters.analysisType === "variance"
        ) {
          const periods =
            await this.dataService.getPeriods(
              request.context,
            );

          if (!periodId && periods.length >= 1) {
            periodId = periods[0].id;
          }

          if (
            !comparePeriodId &&
            periods.length >= 2
          ) {
            comparePeriodId = periods[1].id;
          }
        }

        return financialAnalysisService.analyze({
          context: request.context,
          analysisType:
            parameters.analysisType ??
            "revenue",
          periodId,
          comparePeriodId,
          classification:
            request.classification,
        });
      }

      case "ratios":
        return financialRatiosService.calculate({
          context: request.context,
          periodId: request.periodId,
          ratioTypes:
            parameters.ratioTypes as
              | Parameters<
                  typeof financialRatiosService.calculate
                >[0]["ratioTypes"]
              | undefined,
        });

      case "forecast":
        return financialForecastService.forecast({
          context: request.context,
          periodId: request.periodId,
          periods:
            parameters.forecastPeriods ??
            4,
          method:
            parameters.forecastMethod ??
            "historical_average",
          classification:
            request.classification,
        });

      case "budget":
        return financialBudgetService.calculate({
          context: request.context,
          periodId: request.periodId,
          lines:
            (parameters.budgetLines ??
              []) as Parameters<
              typeof financialBudgetService.calculate
            >[0]["lines"],
        });

      case "scenario":
        return financialScenarioService.calculate({
          context: request.context,
          periodId: request.periodId,
          type:
            parameters.scenarioType ??
            "base",
          adjustments:
            parameters.scenarioAdjustments ??
            [],
          classification:
            request.classification,
        });

      case "sensitivity":
        if (
          !parameters.sensitivityMetric ||
          !parameters.sensitivityValues
        ) {
          throw new Error(
            "Sensitivity requires metric and values.",
          );
        }

        return financialSensitivityService.calculate({
          context: request.context,
          periodId: request.periodId,
          classification:
            request.classification,
          variable: {
            metric:
              parameters.sensitivityMetric,
            values:
              parameters.sensitivityValues,
          },
        });

      case "investment":
        if (
          parameters.initialInvestment ===
            undefined ||
          !parameters.cashFlows
        ) {
          throw new Error(
            "Investment requires initialInvestment and cashFlows.",
          );
        }

        return financialInvestmentService.calculate({
          context: request.context,
          periodId: request.periodId,
          initialInvestment:
            parameters.initialInvestment,
          cashFlows:
            parameters.cashFlows,
          discountRate:
            parameters.discountRate,
        });

      case "risk":
        return financialRiskService.calculate({
          context: request.context,
          periodId: request.periodId,
        });
      case "valuation":
        return financialValuationService.calculate({
          context: request.context,
          periodId: request.periodId,
          method:
            parameters.valuationMethod ??
            "dcf",
          revenue:
            parameters.revenue,
          ebitda:
            parameters.ebitda,
          cashFlows:
            parameters.cashFlows,
          discountRate:
            parameters.discountRate,
          terminalGrowthRate:
            parameters.terminalGrowthRate,
          revenueMultiple:
            parameters.revenueMultiple,
          ebitdaMultiple:
            parameters.ebitdaMultiple,
        });

      case "report":
        return financialExecutiveReportsService.generate({
          context: request.context,
          periodId: request.periodId,
          type:
            parameters.reportType ??
            "financial_summary",
        });

      default:
        throw new Error(
          `Unsupported financial copilot intent: ${intent}`,
        );
    }
  }
}

export const financialCopilotRouter =
  new FinancialCopilotRouter();


