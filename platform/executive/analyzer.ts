import type {
  ExecutiveHealth,
  ExecutiveOpportunity,
  ExecutiveRecommendation,
  ExecutiveRisk,
  ExecutiveSummary,
} from "./dto";

export interface ExecutiveAnalysis {

  summary: ExecutiveSummary;

  risks: ExecutiveRisk[];

  opportunities: ExecutiveOpportunity[];

  recommendations: ExecutiveRecommendation[];

}

export class ExecutiveAnalyzer {

  analyze(
    health: ExecutiveHealth
  ): ExecutiveAnalysis {

    const risks: ExecutiveRisk[] = [];

    const opportunities: ExecutiveOpportunity[] = [];

    const recommendations: ExecutiveRecommendation[] = [];

    if (health.sales < 70) {

      risks.push({

        title: "Low Sales Performance",

        description:
          "La tasa de éxito es inferior al objetivo.",

        severity: "high",

      });

      recommendations.push({

        title: "Reforzar seguimiento",

        description:
          "Priorizar los leads con mayor probabilidad de cierre.",

        priority: "high",

      });

    }

    if (health.pipeline < 60) {

      opportunities.push({

        title: "Expandir Pipeline",

        description:
          "Incrementar la captación de nuevos leads.",

        impact: "medium",

      });

    }

    if (health.ai >= 90) {

      opportunities.push({

        title: "Excelente rendimiento IA",

        description:
          "Los agentes de IA mantienen una alta tasa de éxito.",

        impact: "high",

      });

    }

    const status: ExecutiveSummary["status"] =

      health.overall >= 90

        ? "excellent"

        : health.overall >= 75

          ? "good"

          : health.overall >= 60

            ? "warning"

            : "critical";

    return {

      summary: {

        status,

        headline:
          "Executive Intelligence Report",

        generatedAt:
          new Date().toISOString(),

      },

      risks,

      opportunities,

      recommendations,

    };

  }

}

export const executiveAnalyzer =
  new ExecutiveAnalyzer();