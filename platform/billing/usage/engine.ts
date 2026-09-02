import {
  aiUsageService,
} from "./service";

import type {
  AIUsageRequest,
  AIUsageResult,
} from "./types";

export class AIUsageEngine {

  async checkFollowup(
    request: AIUsageRequest
  ): Promise<AIUsageResult> {

    return aiUsageService.checkFollowup(
      request
    );

  }

}

export const aiUsageEngine =
  new AIUsageEngine();
