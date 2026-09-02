import type {
  WorkflowScore,
} from "../scorer";

import type {
  DecisionRanking,
  RankedWorkflow,
} from "./types";

export function rankWorkflows(

  scores: WorkflowScore[]

): DecisionRanking {

  if (scores.length === 0) {

    throw new Error(
      "No hay workflows para clasificar."
    );

  }

  /*
  ---------------------------------------
  Sort
  ---------------------------------------
  */

  const ordered =

    [...scores]

      .sort(

        (a, b) =>

          b.score - a.score

      );

  /*
  ---------------------------------------
  Ranking
  ---------------------------------------
  */

  const ranking: RankedWorkflow[] =

    ordered.map(

      (

        item,

        index

      ) => ({

        rank:
          index + 1,

        workflow:
          item.workflow,

        score:
          item.score,

      })

    );

  /*
  ---------------------------------------
  Winner
  ---------------------------------------
  */

  const winner =
    ranking[0];

  /*
  ---------------------------------------
  Tie Detection
  ---------------------------------------
  */

  const tied =

    ranking.filter(

      item =>

        item.score === winner.score

    );

  /*
  ---------------------------------------
  Confidence
  ---------------------------------------
  */

  const confidence =

    ranking.length === 1

      ? 1

      : Math.min(

          1,

          Math.max(

            0,

            (

              winner.score -

              ranking[1].score

            ) / 100

          )

        );

  /*
  ---------------------------------------
  Metadata
  ---------------------------------------
  */

  return {

    winner,

    ranking,

    metadata: {

      totalWorkflows:
        ranking.length,

      tied:

        tied.length > 1,

      tiedCount:
        tied.length,

      confidence,

      topScore:
        winner.score,

    },

  };

}