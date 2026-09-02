import type {
  NextBestAction,
} from "./types";

export interface NextBestActionRanking {

  winner: NextBestAction;

  ranking: NextBestAction[];

}

export function rankActions(

  actions: NextBestAction[]

): NextBestActionRanking {

  if (actions.length === 0) {

    throw new Error(
      "No existen acciones para clasificar."
    );

  }

  const ranking =
    [...actions].sort(

      (a, b) => {

        if (

          b.priority !==
          a.priority

        ) {

          return (
            b.priority -
            a.priority
          );

        }

        return (
          b.confidence -
          a.confidence
        );

      }

    );

  return {

    winner:
      ranking[0],

    ranking,

  };

}