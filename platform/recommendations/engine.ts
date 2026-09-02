import {
  LeadIntelligenceResult,
} from "@/platform/intelligence";

import {
  Recommendation,
  RecommendationResult,
} from "./types";

export class RecommendationsEngine {

  generate(
    intelligence: LeadIntelligenceResult
  ): RecommendationResult {

    const recommendations: Recommendation[] = [];

    if (intelligence.priority >= 90) {

      recommendations.push({

        title:
          "Contactar inmediatamente",

        description:
          "Lead con prioridad muy alta.",

        priority: 100,

        action: "call",

      });

    }

    if (intelligence.temperature === "HOT") {

      recommendations.push({

        title:
          "Generar Follow-up IA",

        description:
          "Enviar seguimiento personalizado.",

        priority: 90,

        action: "followup",

      });

    }

    if (intelligence.personality === "premium") {

      recommendations.push({

        title:
          "Agendar reunión",

        description:
          "Lead premium detectado.",

        priority: 85,

        action: "meeting",

      });

    }

    if (intelligence.risk === "HIGH") {

      recommendations.push({

        title:
          "Reactivar lead",

        description:
          "Existe riesgo alto de pérdida.",

        priority: 95,

        action: "whatsapp",

      });

    }

    recommendations.sort(

      (a, b) =>

        b.priority - a.priority

    );

    return {

      recommendations,

    };

  }

}

export const recommendationsEngine =
  new RecommendationsEngine();
