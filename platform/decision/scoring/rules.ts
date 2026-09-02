import type {
  DecisionContext,
} from "../context";

import {
  DecisionWeights,
} from "../config";

export interface RulesScore {

  score: number;

  reason: string;

}

export function scoreRules(

  context: DecisionContext

): RulesScore {

  let score = 0;

  /*
  ---------------------------------------
  High Probability Lead
  ---------------------------------------
  */

  if (

    (context.probability ?? 0) >= 80

  ) {

    score += DecisionWeights.rules;

  }

  return {

    score,

    reason:
      "Business rules evaluadas.",

  };

}