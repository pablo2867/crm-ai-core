import { getDashboardData } from "@/lib/dashboard-data";

import {
  aiSalesManagerService,
} from "@/platform/services/ai-sales-manager";

import {
  intelligenceEngine,
} from "@/platform/intelligence";

import {
  recommendationsEngine,
} from "@/platform/recommendations";

import {
  executiveEngine,
} from "@/platform/executive";

import type {
  ExecutiveDashboardDTO,
} from "@/platform/executive";

export interface ExecutiveBusiness {

  totalLeads: number;

  estimatedRevenue: number;

  forecastRevenue: number;

  conversionRate: number;

}

export interface ExecutiveDashboardData {

  lead:
    Awaited<
      ReturnType<
        typeof aiSalesManagerService.execute
      >
    >["priorityLeads"][number] | null;

  priorityLeads:
    Awaited<
      ReturnType<
        typeof aiSalesManagerService.execute
      >
    >["priorityLeads"];

  analyzed: number;

  executed: number;

  pipelineAnalysis:
    Awaited<
      ReturnType<
        typeof aiSalesManagerService.execute
      >
    >["pipelineAnalysis"] | null;

  strategy:
    Awaited<
      ReturnType<
        typeof aiSalesManagerService.execute
      >
    >["strategy"] | null;

  /*
  ---------------------------------------
  Executive Intelligence
  ---------------------------------------
  */

  executiveSummary:
    ExecutiveDashboardDTO | null;

  /*
  ---------------------------------------
  Legacy Business KPI
  (compatibilidad temporal)
  ---------------------------------------
  */

  business:
    ExecutiveBusiness | null;

  intelligence:
    ReturnType<
      typeof intelligenceEngine.evaluateLeadRecord
    > | null;

  recommendations:
    ReturnType<
      typeof recommendationsEngine.generate
    > | null;

}

export class ExecutiveDashboardService {

  async get(
    userId: string
  ): Promise<ExecutiveDashboardData> {

    const [
      salesManager,
      executiveSummary,
      dashboardData,
    ] = await Promise.all([

      aiSalesManagerService.execute(
      userId,
      {
        executeActions: false,
      }
    ),

      executiveEngine.execute(
        userId
      ),

      getDashboardData(
        userId
      ),

    ]);

    const lead =
      salesManager.priorityLeads[0] ??
      null;

    const pipelineAnalysis =
      salesManager.pipelineAnalysis;

    const strategy =
      salesManager.strategy;

    /*
    ---------------------------------------
    Compatibilidad temporal
    ---------------------------------------
    */

    const business: ExecutiveBusiness = {

      totalLeads:
        0,

      estimatedRevenue:
        0,

      forecastRevenue:
        0,

      conversionRate:
        executiveSummary.health.sales,

    };

    if (!lead) {

      return {

        lead: null,

        priorityLeads: [],

        analyzed: salesManager.analyzed,

        executed: salesManager.executed,

        pipelineAnalysis,

        strategy,

        executiveSummary,

        business,

        intelligence: null,

        recommendations: null,

      };

    }

    const intelligence =
      intelligenceEngine.evaluateLeadRecord({

        email:
          lead.email,

        company:
          lead.company,

        ai_score:
          lead.ai_score,

      });

    const recommendations =
      recommendationsEngine.generate(
        intelligence
      );

    return {

      lead,

      priorityLeads:
        salesManager.priorityLeads,

      analyzed:
        salesManager.analyzed,

      executed:
        salesManager.executed,

      pipelineAnalysis,

      strategy,

      executiveSummary,

      business,

      intelligence,

      recommendations,

    };

  }

}

export const executiveDashboardService =
  new ExecutiveDashboardService();




