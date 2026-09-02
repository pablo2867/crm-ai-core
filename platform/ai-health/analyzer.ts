import type {
  AIHealthComponent,
  AIHealthStatus,
} from "./types";

export interface AIHealthAnalyzerInput {

  id: string;

  name: string;

  averageDuration: number;

  executions: number;

  successRate: number;

}

export class AIHealthAnalyzer {

  analyze(
    input: AIHealthAnalyzerInput,
  ): AIHealthComponent {

    const score = this.calculateScore(input);

    const status = this.resolveStatus(score);

    return {

      id: input.id,

      name: input.name,

      status,

      score,

      averageDuration: input.averageDuration,

      executions: input.executions,

      successRate: input.successRate,

      message: this.buildMessage(status),

      recommendation:
        this.buildRecommendation(status),

    };

  }

  private calculateScore(
    input: AIHealthAnalyzerInput,
  ): number {

    let score = Math.round(
      input.successRate,
    );

    if (input.averageDuration > 500) {

      score -= 20;

    } else if (input.averageDuration > 250) {

      score -= 10;

    }

    return Math.max(
      0,
      Math.min(score, 100),
    );

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

  private buildMessage(
    status: AIHealthStatus,
  ): string {

    switch (status) {

      case "healthy":

        return "El componente opera correctamente.";

      case "warning":

        return "Se detectó una degradación moderada.";

      case "critical":

        return "Se requiere atención inmediata.";

    }

  }

  private buildRecommendation(
    status: AIHealthStatus,
  ): string | undefined {

    switch (status) {

      case "healthy":

        return "No se requiere ninguna acción.";

      case "warning":

        return "Revisar tiempos de ejecución y métricas recientes.";

      case "critical":

        return "Analizar registros, workflows y dependencias.";

    }

  }

}

export const aiHealthAnalyzer =
  new AIHealthAnalyzer();