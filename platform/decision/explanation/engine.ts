import {
  buildDecisionExplanation,
} from "./builder";

import type {
  DecisionExplanation,
  DecisionExplanationRequest,
} from "./types";

export class DecisionExplanationEngine {

  explain(
    request: DecisionExplanationRequest
  ): DecisionExplanation {

    return buildDecisionExplanation(
      request
    );

  }

}

export const decisionExplanationEngine =
  new DecisionExplanationEngine();