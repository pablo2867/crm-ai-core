import type {
  LeadAnalysis,
} from "./types";

import type {
  Lead,
} from "@/platform/services/lead-service";

export class LeadAnalyzer {

  analyze(
    lead: Lead
  ): LeadAnalysis {

    const score =
      Number(
        lead.ai_score ?? 0
      );

    const probability =
      Number(
        lead.close_probability ?? 0
      );

    const revenue =
      Number(
        lead.estimated_revenue ?? 0
      );

    const status =
      (lead.status ?? "")
        .toLowerCase();

    const temperature =
      score >= 80
        ? "HOT"
        : score >= 50
        ? "WARM"
        : "COLD";

    const priority =
      probability >= 70
        ? "HIGH"
        : probability >= 40
        ? "MEDIUM"
        : "LOW";

    const risk =
      probability >= 70
        ? "LOW"
        : probability >= 40
        ? "MEDIUM"
        : "HIGH";

    let nextAction =
      "Revisar información del lead.";

    let reason =
      "Lead con información limitada.";

    /*
    ---------------------------------------
    Lead de alta prioridad
    ---------------------------------------
    */

    if (
      score >= 80 &&
      probability >= 70
    ) {

      nextAction =
        "Contactar inmediatamente y preparar propuesta comercial.";

      reason =
        "Lead con alta probabilidad de cierre y alto score.";

    }

    /*
    ---------------------------------------
    Lead en seguimiento
    ---------------------------------------
    */

    else if (
      score >= 60
    ) {

      nextAction =
        "Programar seguimiento durante las próximas 24 horas.";

      reason =
        "Lead con potencial que requiere continuidad.";

    }

    /*
    ---------------------------------------
    Lead frÃ­o
    ---------------------------------------
    */

    else {

      nextAction =
        "Iniciar campaña de nutriciÃ³n y reactivar interés.";

      reason =
        "Lead con baja probabilidad de conversiÃ³n inmediata.";

    }

    /*
    ---------------------------------------
    Ajustes por estado
    ---------------------------------------
    */

    if (
      status === "contactado"
    ) {

      nextAction =
        "Dar seguimiento a la conversación iniciada.";

    }

    if (
      status === "cerrado"
    ) {

      nextAction =
        "Registrar resultados y buscar oportunidades de venta adicional.";

      reason =
        "Lead ya convertido.";

    }

    return {

      id:
        lead.id,

      name:
        lead.name,

      company:
        lead.company,

      status:
        lead.status,

      score,

      probability,

      revenue,

      temperature,

      priority,

      risk,

      nextAction,

      reason,

    };

  }

}

export const leadAnalyzer =
  new LeadAnalyzer();
