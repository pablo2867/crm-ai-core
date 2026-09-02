import type {
  Workflow,
} from "@/platform/workflows";

import type {
  DecisionContext,
} from "../context";

import {
  DecisionWeights,
} from "../config";

export interface IntentScore {

  score: number;

  matched: boolean;

  reason: string;

}

export function scoreIntent(

  workflow: Workflow,

  context: DecisionContext

): IntentScore {

  const intents =
    workflow.metadata?.supportedIntents ?? [];

  const matched =
    intents.includes(
      context.intent
    );

  if (!matched) {

    return {

      score: 0,

      matched: false,

      reason:
        "Intent no soportado.",

    };

  }

  /*
  ---------------------------------------
  Intent Specificity
  ---------------------------------------

  Los workflows especializados reciben
  mayor puntuación de intención.

  Los workflows multipropósito conservan
  una puntuación suficiente para seguir
  siendo competitivos.

  1 intent  -> 40
  2 intents -> 30
  3 intents -> 25
  4 intents -> 22
  5+        -> 20

  El máximo nunca supera
  DecisionWeights.intent.
  ---------------------------------------
  */

  const supportedIntentCount =
    Math.max(
      intents.length,
      1
    );

  let specificityScore: number;

  switch (supportedIntentCount) {

    case 1:

      specificityScore =
        DecisionWeights.intent;

      break;

    case 2:

      specificityScore =
        30;

      break;

    case 3:

      specificityScore =
        25;

      break;

    case 4:

      specificityScore =
        22;

      break;

    default:

      specificityScore =
        20;

      break;

  }

  const score =
    Math.min(
      specificityScore,
      DecisionWeights.intent
    );

  return {

    score,

    matched: true,

    reason:
      `Intent compatible. Especificidad: ${supportedIntentCount} intent(s) soportado(s).`,

  };

}
