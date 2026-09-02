import {
  buildRules,
} from "./rules";

import {
  rankActions,
} from "./ranking";

import {
  buildExplanation,
} from "./explanation";

import type {
  NextBestActionRequest,
  NextBestActionResult,
} from "./types";

export class NextBestActionEngine {

  async analyze(

    request: NextBestActionRequest

  ): Promise<NextBestActionResult> {

    /*
    ---------------------------------------
    Generate Candidates
    ---------------------------------------
    */

    const actions =
      buildRules(
        request
      );

    /*
    ---------------------------------------
    Ranking
    ---------------------------------------
    */

    const ranking =
      rankActions(
        actions
      );

    /*
    ---------------------------------------
    Explanation
    ---------------------------------------
    */

    const explanation =
      buildExplanation(

        ranking.winner,

        request

      );

    /*
    ---------------------------------------
    Result
    ---------------------------------------
    */

    return {

      success: true,

      recommendation:
        ranking.winner,

      alternatives:
        ranking.ranking.slice(1),

      explanation,

    };

  }

}

export const nextBestActionEngine =
  new NextBestActionEngine();