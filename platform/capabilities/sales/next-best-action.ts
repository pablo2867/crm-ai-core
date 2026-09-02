import type {
  Capability,
  CapabilityRequest,
  CapabilityResult,
} from "../types";

export const nextBestActionCapability: Capability = {

  id:
    "sales.next-best-action",

  name:
    "Next Best Action",

  async execute(
    request: CapabilityRequest
  ): Promise<CapabilityResult> {

    const context =
      request.input ?? {};

    const lead =
      context.lead as
        | Record<string, unknown>
        | undefined;

    if (!lead) {

      return {

        success: false,

        message:
          "No existe información del lead.",

      };

    }

    const score =
      Number(
        lead.ai_score ?? 0
      );

    const probability =
      Number(
        lead.close_probability ?? 0
      );

    const temperature =
      String(
        lead.ai_temperature ?? "COLD"
      );

    let action =
      "Solicitar información adicional.";

    let priority =
      "MEDIA";

    if (
      temperature === "HOT" ||
      score >= 90 ||
      probability >= 80
    ) {

      action =
        "Llamar al cliente inmediatamente.";

      priority =
        "ALTA";

    }

    else if (
      score >= 70
    ) {

      action =
        "Enviar seguimiento personalizado.";

    }

    else if (
      score >= 40
    ) {

      action =
        "Programar recordatorio en 48 horas.";

    }

    else {

      action =
        "Iniciar campaña de nurturing.";

      priority =
        "BAJA";

    }

    return {

      success: true,

      message:
        action,

      data: {

        recommendation:
          action,

        priority,

        score,

        probability,

        temperature,

      },

    };

  },

};
