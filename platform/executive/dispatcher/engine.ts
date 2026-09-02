import {
  capabilityEngine,
} from "@/platform/capabilities";

import {
  recommendationRegistry,
} from "./registry";

import type {
  DispatchRequest,
  DispatchResult,
} from "./types";

export class RecommendationDispatcher {

  async dispatch(
    request: DispatchRequest
  ): Promise<DispatchResult> {

    const executed: string[] = [];

    for (const recommendation of request.recommendations) {

      const action =
        recommendationRegistry.find(

          item =>

            item.recommendationId ===
            recommendation.id

        );

      if (!action) {
        continue;
      }

      const result =
        await capabilityEngine.execute(

          action.capabilityId,

          {

            userId:
              request.userId,

            goal:
              action.capabilityId,

          }

        );

      if (result.success) {

        executed.push(
          action.capabilityId
        );

      }

    }

    return {

      executed,

    };

  }

}

export const recommendationDispatcher =
  new RecommendationDispatcher();