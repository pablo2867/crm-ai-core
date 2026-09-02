import type { PipelineAnalysis } from "@/platform/agents/sales/pipeline-analyzer";

export interface HealthResult {
  score: number;
  status: "healthy" | "warning" | "critical";
  reasons: string[];
}

export class HealthEngine {
  calculate(
    pipeline: PipelineAnalysis
  ): HealthResult {

    let score = 100;

    const reasons: string[] = [];

    // Riesgo alto
    if (pipeline.highRisk > 0) {
      score -= pipeline.highRisk * 8;

      reasons.push(
        `${pipeline.highRisk} leads de alto riesgo`
      );
    }

    // Riesgo medio
    if (pipeline.mediumRisk > 0) {
      score -= pipeline.mediumRisk * 3;

      reasons.push(
        `${pipeline.mediumRisk} leads de riesgo medio`
      );
    }

    // Leads calientes
    if (pipeline.hotLeads > 0) {
      score += Math.min(
        pipeline.hotLeads * 2,
        10
      );

      reasons.push(
        `${pipeline.hotLeads} HOT leads`
      );
    }

    // Score promedio
    if (pipeline.averageScore < 50) {
      score -= 15;

      reasons.push(
        "Score promedio bajo"
      );
    }

    score = Math.max(
      0,
      Math.min(score, 100)
    );

    let status: HealthResult["status"] =
      "healthy";

    if (score < 50) {
      status = "critical";
    } else if (score < 75) {
      status = "warning";
    }

    return {
      score,
      status,
      reasons,
    };
  }
}

export const healthEngine =
  new HealthEngine();