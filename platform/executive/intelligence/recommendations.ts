import type {
  ExecutiveOpportunity,
  ExecutiveRecommendation,
  ExecutiveRisk,
} from "./types";

export class RecommendationEngine {

  generate(

    opportunities: ExecutiveOpportunity[],

    risks: ExecutiveRisk[]

  ): ExecutiveRecommendation[] {

    const recommendations:
      ExecutiveRecommendation[] = [];

    /*
    ---------------------------------------
    Riesgos
    ---------------------------------------
    */

    for (const risk of risks) {

      switch (risk.id) {

        case "low-pipeline":

          recommendations.push({

            id:
              "increase-lead-generation",

            title:
              "Incrementar captación",

            description:
              "Ejecutar campañas para generar nuevos leads.",

          });

          break;

        case "forecast-drop":

          recommendations.push({

            id:
              "recover-pipeline",

            title:
              "Recuperar pipeline",

            description:
              "Priorizar oportunidades con mayor probabilidad de cierre.",

          });

          break;

        case "no-sales":

          recommendations.push({

            id:
              "focus-hot-leads",

            title:
              "Trabajar leads HOT",

            description:
              "Concentrar al equipo comercial en los leads con mayor intención de compra.",

          });

          break;

        case "low-conversion":

          recommendations.push({

            id:
              "review-sales-process",

            title:
              "Revisar proceso comercial",

            description:
              "Analizar objeciones, seguimiento y tiempos de respuesta.",

          });

          break;

      }

    }

    /*
    ---------------------------------------
    Oportunidades
    ---------------------------------------
    */

    for (const opportunity of opportunities) {

      switch (opportunity.id) {

        case "many-active-leads":

          recommendations.push({

            id:
              "execute-sales-followup",

            title:
              "Ejecutar Sales Follow-up",

            description:
              "Lanzar automáticamente la Capability de seguimiento comercial.",

          });

          break;

        case "forecast-growth":

          recommendations.push({

            id:
              "increase-sales-capacity",

            title:
              "Preparar capacidad comercial",

            description:
              "El forecast indica crecimiento; conviene acelerar el cierre de oportunidades.",

          });

          break;

        case "open-opportunities":

          recommendations.push({

            id:
              "prioritize-open-opportunities",

            title:
              "Priorizar oportunidades abiertas",

            description:
              "Revisar los leads pendientes y asignar tareas de seguimiento.",

          });

          break;

      }

    }

    return recommendations;

  }

}

export const recommendationEngine =
  new RecommendationEngine();
