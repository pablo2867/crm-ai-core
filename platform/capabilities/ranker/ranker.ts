import type {
  CapabilityScore,
} from "../scorer";

import type {
  CapabilityRanking,
} from "./types";

export function rankCapabilities(

  scores: CapabilityScore[]

): CapabilityRanking {

  if (scores.length === 0) {

    throw new Error(
      "No hay capabilities para evaluar."
    );

  }

  const ranking =

    [...scores]

      .sort(

        (a, b) =>

          b.score - a.score

      );

  return {

    winner:
      ranking[0],

    ranking,

  };

}