import type {
  CEOPlan,
  CEOResult,
} from "./types";

import {
  executiveEngine,
} from "@/platform/executive";

import type {
  ExecutiveRisk,
  ExecutiveRecommendation,
} from "@/platform/executive";

export class CEOExecutor {

  async execute(
    plan: CEOPlan,
    userId: string
  ): Promise<CEOResult> {

    const report =
      await executiveEngine.execute(
        userId
      );

    const summary = [

      `Objetivo: ${plan.objective}`,

      `Business Health: ${report.health.overall}/100`,

      "",

      "Riesgos:",

      ...report.risks.map(

        (
          risk: ExecutiveRisk
        ) =>
          `• ${risk.title}`

      ),

      "",

      "Oportunidades:",

      ...report.opportunities.map(

        opportunity =>
          `• ${opportunity.title}`

      ),

      "",

      "Recomendaciones:",

      ...report.recommendations.map(

        (
          recommendation: ExecutiveRecommendation
        ) =>
          `• ${recommendation.title}`

      ),

    ].join("\n");

    return {

      success: true,

      summary,

      priorities:
        plan.priorities,

    };

  }

}

export const ceoExecutor =
  new CEOExecutor();
