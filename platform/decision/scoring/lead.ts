import type {
  DecisionContext,
} from "../context";

import type {
  Workflow,
} from "@/platform/workflows";

import {
  DecisionWeights,
} from "../config";

export interface LeadScore {

  score: number;

  reason: string;

}

export function scoreLead(

  context: DecisionContext,

  workflow: Workflow

): LeadScore {

  const tags =
    workflow.metadata?.tags ?? [];

  const category =
    workflow.metadata?.category
      ?.toLowerCase() ?? "";

  const isLeadWorkflow =
    category === "sales" ||
    tags.includes("lead") ||
    tags.includes("followup") ||
    tags.includes("task");

  if (!isLeadWorkflow) {

    return {

      score: 0,

      reason:
        "Lead no relevante para este workflow.",

    };

  }

  let score = 0;

  if (
    context.aiScore >= 80
  ) {

    score +=
      DecisionWeights.aiScore;

  }

  if (
    context.estimatedRevenue >= 10000
  ) {

    score +=
      DecisionWeights.revenue;

  }

  return {

    score,

    reason:
      "Lead evaluado para workflow comercial.",

  };

}