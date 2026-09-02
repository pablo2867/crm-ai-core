import type {
  ExecutiveRecommendation,
} from "./types";

import type {
  BusinessContext,
} from "@/platform/context";

export class RecommendationEngine {

  generate(
    context: BusinessContext
  ): ExecutiveRecommendation[] {

    const items:
      ExecutiveRecommendation[] = [];

    if (
      context.metrics.totalLeads === 0
    ) {

      items.push({

        title:
          "Captar nuevos leads",

        description:
          "El pipeline necesita oportunidades.",

        priority: 100,

      });

    }

    return items;

  }

}

export const recommendationEngine =
  new RecommendationEngine();