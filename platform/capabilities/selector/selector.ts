import {
  matchCapabilities,
} from "../matcher";

import {
  scoreCapabilities,
} from "../scorer";

import {
  rankCapabilities,
} from "../ranker";

import type {
  CapabilitySelectionRequest,
  CapabilitySelectionResult,
} from "./types";

export function selectCapability(
  request: CapabilitySelectionRequest
): CapabilitySelectionResult {

  /*
  ---------------------------------------
  Matcher
  ---------------------------------------
  */

  const matches =
    matchCapabilities({

      capabilities:
        request.capabilities,

      context:
        request.context,

      intent:
        request.context.intent,

    });

  if (matches.length === 0) {

    throw new Error(
      "No se encontró ninguna Capability compatible."
    );

  }

  /*
  ---------------------------------------
  Scoring
  ---------------------------------------
  */

  const scored =
    scoreCapabilities({

      capabilities:
        matches,

      context:
        request.context,

    });

  /*
  ---------------------------------------
  Ranking
  ---------------------------------------
  */

  const ranking =
    rankCapabilities(
      scored
    );

  /*
  ---------------------------------------
  Resultado
  ---------------------------------------
  */

  return {

    capability:
      ranking.winner.capability,

    ranking,

    context:
      request.context,

  };

}
