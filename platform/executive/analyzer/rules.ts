import type {
  BusinessContext,
} from "@/platform/context";

import type {
  ExecutiveInsight,
} from "./types";

export class ExecutiveRules {

  evaluate(
    context: BusinessContext
  ): ExecutiveInsight[] {

    const insights: ExecutiveInsight[] = [];

    if (
      context.health.status ===
      "critical"
    ) {

      insights.push({

        title:
          "Negocio en estado crítico",

        description:
          "La salud del negocio requiere atención inmediata.",

        severity:
          "critical",

      });

    }

    if (
      context.metrics.totalLeads === 0
    ) {

      insights.push({

        title:
          "Sin oportunidades",

        description:
          "No existen leads registrados.",

        severity:
          "warning",

      });

    }

    return insights;

  }

}

export const executiveRules =
  new ExecutiveRules();