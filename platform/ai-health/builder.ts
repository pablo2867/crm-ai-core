import type {
  AIHealthBuilderRequest,
  AIHealthReport,
  AIHealthStatus,
} from "./types";

export class AIHealthBuilder {

  build(
    request: AIHealthBuilderRequest,
  ): AIHealthReport {

    const components = request.components;

    const overallScore =
      components.length === 0
        ? 100
        : Math.round(
            components.reduce(
              (total, component) => total + component.score,
              0,
            ) / components.length,
          );

    const overallStatus =
      this.resolveStatus(overallScore);

    return {

      overallScore,

      overallStatus,

      generatedAt: new Date().toISOString(),

      components,

    };

  }

  private resolveStatus(
    score: number,
  ): AIHealthStatus {

    if (score >= 90) {

      return "healthy";

    }

    if (score >= 70) {

      return "warning";

    }

    return "critical";

  }

}

export const aiHealthBuilder =
  new AIHealthBuilder();