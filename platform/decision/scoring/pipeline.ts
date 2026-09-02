import type {
  DecisionContext,
} from "../context";

import {
  DecisionWeights,
} from "../config";

export interface PipelineScore {

  score: number;

  reason: string;

}

export function scorePipeline(

  context: DecisionContext

): PipelineScore {

  const stage =

    context.pipelineStage?.toLowerCase() ?? "";

  switch (stage) {

    case "prospecting":

      return {

        score: 2,

        reason: "Lead en prospección.",

      };

    case "qualified":

      return {

        score: 5,

        reason: "Lead calificado.",

      };

    case "proposal":

      return {

        score: 8,

        reason: "Propuesta enviada.",

      };

    case "negotiation":

      return {

        score: DecisionWeights.pipeline,

        reason: "Lead en negociación.",

      };

    case "won":

      return {

        score: 0,

        reason: "Lead cerrado.",

      };

    default:

      return {

        score: 0,

        reason: "Sin etapa de pipeline.",

      };

  }

}
