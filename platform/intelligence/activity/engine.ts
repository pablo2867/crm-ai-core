import {
  analyzeActivities,
} from "./analyzer";

import type {
  ActivityAnalysisRequest,
  ActivityIntelligence,
} from "./types";

export class ActivityIntelligenceEngine {

  analyze(
    request: ActivityAnalysisRequest
  ): ActivityIntelligence {

    return analyzeActivities(
      request
    );

  }

}

export const activityIntelligenceEngine =
  new ActivityIntelligenceEngine();