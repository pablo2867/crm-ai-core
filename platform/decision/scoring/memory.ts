import type {
  DecisionContext,
} from "../context";

import type {
  Workflow,
} from "@/platform/workflows";

import {
  DecisionWeights,
} from "../config";

export interface MemoryScore {

  score: number;

  reason: string;

}

export function scoreMemory(

  context: DecisionContext,

  workflow: Workflow

): MemoryScore {

  const memory =
    context.executiveMemory;

  if (!memory) {

    return {

      score: 0,

      reason:
        "Sin memoria ejecutiva.",

    };

  }

  const matchesWorkflow =
    memory.workflow === workflow.id ||
    memory.workflow ===
      workflow.metadata?.capabilityId;

  if (!matchesWorkflow) {

    return {

      score: 0,

      reason:
        "Memoria no relacionada con este workflow.",

    };

  }

  return {

    score:
      DecisionWeights.executiveMemory,

    reason:
      "Memoria ejecutiva relacionada con el workflow.",

  };

}