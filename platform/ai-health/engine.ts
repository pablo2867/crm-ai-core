import {
  aiHealthAnalyzer,
  type AIHealthAnalyzerInput,
} from "./analyzer";

import {
  aiHealthBuilder,
} from "./builder";

import type {
  AIHealthReport,
} from "./types";

export interface AIHealthEngineRequest {

  components: AIHealthAnalyzerInput[];

}

export class AIHealthEngine {

  generateReport(
    request: AIHealthEngineRequest,
  ): AIHealthReport {

    const analyzedComponents =
      request.components.map((component) =>
        aiHealthAnalyzer.analyze(component),
      );

    return aiHealthBuilder.build({

      components: analyzedComponents,

    });

  }

}

export const aiHealthEngine =
  new AIHealthEngine();