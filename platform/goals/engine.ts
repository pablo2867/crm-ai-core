import {
  goalResolver,
} from "./resolver";

import type {
  GoalRequest,
} from "./types";

export class GoalEngine {

  resolve(
    request: GoalRequest
  ) {

    return goalResolver.resolve(
      request
    );

  }

}

export const goalEngine =
  new GoalEngine();