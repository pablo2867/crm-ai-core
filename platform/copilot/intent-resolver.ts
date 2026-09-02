import {
  intents,
} from "@/platform/manifest";

export interface CopilotIntent {

  intent: string;

  confidence: number;

}

class CopilotIntentResolver {

  private resolveFromManifest(
    text: string
  ): CopilotIntent | null {

    /*
    ---------------------------------------
    Lead Ranking
    ---------------------------------------
    Las consultas de análisis de leads
    deben tener prioridad sobre la keyword
    genérica "lead".
    ---------------------------------------
    */

    if (

      (
        text.includes("qué leads") ||
        text.includes("que leads") ||
        text.includes("cuáles leads") ||
        text.includes("cuales leads") ||
        text.includes("qué lead") ||
        text.includes("que lead") ||
        text.includes("cuál lead") ||
        text.includes("cual lead")
      )

      &&

      (
        text.includes("probabilidad") ||
        text.includes("probable") ||
        text.includes("cierre") ||
        text.includes("cerrar") ||
        text.includes("oportunidad") ||
        text.includes("mejor")
      )

    ) {

      return {

        intent:
          "sales.lead-ranking",

        confidence:
          0.99,

      };

    }

    for (
      const intent of intents
    ) {

      const matched =
        intent.keywords.some(
          (keyword) =>
            text.includes(
              keyword.toLowerCase()
            )
        );

      if (matched) {

        return {

          intent:
            intent.id,

          confidence:
            intent.confidence,

        };

      }

    }

    return null;

  }

  resolve(
    message: string
  ): CopilotIntent | null {

    const text =
      message.toLowerCase();

    /*
    ---------------------------------------
    Manifest
    ---------------------------------------
    */

    const manifestIntent =
      this.resolveFromManifest(
        text
      );

    if (manifestIntent) {

      return manifestIntent;

    }

    /*
    ---------------------------------------
    Daily Priorities
    ---------------------------------------
    */

    if (

      text.includes("prioridades") ||
      text.includes("prioridad") ||
      text.includes("hoy") ||
      text.includes("qué debo hacer") ||
      text.includes("que debo hacer") ||
      text.includes("daily") ||
      text.includes("executive brief") ||
      text.includes("resumen ejecutivo") ||
      text.includes("resumen del día") ||
      text.includes("resumen del dia")

    ) {

      return {

        intent:
          "sales.daily-priorities",

        confidence:
          0.98,

      };

    }

    /*
    ---------------------------------------
    Sales Followup
    ---------------------------------------
    */

    if (

      text.includes("seguimiento") ||
      text.includes("follow") ||
      text.includes("lead")

    ) {

      return {

        intent:
          "sales.followup",

        confidence:
          0.95,

      };

    }

    /*
    ---------------------------------------
    Sales Task
    ---------------------------------------
    */

    if (

      text.includes("tarea") ||
      text.includes("task")

    ) {

      return {

        intent:
          "sales.task",

        confidence:
          0.95,

      };

    }

    /*
    ---------------------------------------
    Marketing
    ---------------------------------------
    */

    if (

      text.includes("campaña") ||
      text.includes("campana") ||
      text.includes("campaign")

    ) {

      return {

        intent:
          "marketing.campaign",

        confidence:
          0.95,

      };

    }

    if (

      text.includes("email")

    ) {

      return {

        intent:
          "marketing.email",

        confidence:
          0.95,

      };

    }

    /*
    ---------------------------------------
    Default
    ---------------------------------------
    */

    return null;

  }

}

const resolver =
  new CopilotIntentResolver();

export function resolveIntent(
  message: string
): CopilotIntent | null {

  return resolver.resolve(
    message
  );

}

export const copilotIntentResolver =
  resolver;

