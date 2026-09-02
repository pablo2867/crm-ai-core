import type {
  PipelineColumnIntelligence,
  PipelineIntelligenceRequest,
  PipelinePriority,
  PipelineRisk,
} from "./types";

export class PipelineAnalyzer {
  analyze(
    request: PipelineIntelligenceRequest
  ): PipelineColumnIntelligence {
    const leads = request.leads;

    const totalLeads = leads.length;

    const revenue = leads.reduce(
      (total, lead) =>
        total +
        Number(
          lead.estimated_revenue ??
            lead.deal_value ??
            0
        ),
      0
    );

    const avgScore =
      totalLeads === 0
        ? 0
        : Math.round(
            leads.reduce(
              (total, lead) =>
                total +
                Number(
                  lead.ai_score ?? 0
                ),
              0
            ) / totalLeads
          );

    const avgProbability =
      totalLeads === 0
        ? 0
        : Math.round(
            leads.reduce(
              (total, lead) =>
                total +
                Number(
                  lead.close_probability ??
                    0
                ),
              0
            ) / totalLeads
          );

    const priority: PipelinePriority =
      avgScore >= 80
        ? "HIGH"
        : avgScore >= 60
        ? "MEDIUM"
        : "LOW";

    const risk: PipelineRisk =
      avgProbability >= 70
        ? "LOW"
        : avgProbability >= 40
        ? "MEDIUM"
        : "HIGH";

    let recommendation =
      "Sin recomendaciones.";

    if (priority === "HIGH") {
      recommendation =
        "Priorizar seguimiento inmediato.";
    }

    if (risk === "HIGH") {
      recommendation =
        "Existe riesgo de perder oportunidades.";
    }

    return {
      totalLeads,
      revenue,
      avgScore,
      avgProbability,
      priority,
      risk,
      recommendation,
    };
  }
}

export const pipelineAnalyzer =
  new PipelineAnalyzer();