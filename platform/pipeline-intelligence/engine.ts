import {
  pipelineAnalyzer,
} from "./analyzer";

import type {
  PipelineColumnIntelligence,
  PipelineIntelligenceRequest,
} from "./types";

export class PipelineIntelligenceEngine {
  analyze(
    request: PipelineIntelligenceRequest
  ): PipelineColumnIntelligence {
    return pipelineAnalyzer.analyze(
      request
    );
  }
}

export const pipelineIntelligenceEngine =
  new PipelineIntelligenceEngine();