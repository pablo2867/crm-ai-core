import type {
  Workflow,
} from "@/platform/workflows";

import type {
  WorkflowScore,
} from "./scorer";

import type {
  DecisionContext,
} from "./context";

import type {
  DecisionExplanation,
} from "./explanation/types";


import type {
DecisionStatus,
} from "./policy";
import type {
  NextBestActionResult,
} from "@/platform/intelligence/next-best-action";

export interface DecisionRequest {

  message: string;

  intent: string;

  userId?: string;

  organizationId?: string;

  workspaceId?: string;

  moduleId?: string;

  context?: Record<
    string,
    unknown
  >;

}

export interface DecisionResponse {

  /*
  ---------------------------------------
  Workflow
  ---------------------------------------
  */

  workflow: Workflow;

  workflowId: string;

  /*
  ---------------------------------------
  Capability
  ---------------------------------------
  */

  capabilityId?: string;

  /*
  ---------------------------------------
  Confidence
  ---------------------------------------
  */

  confidence: number;

  /*
  ---------------------------------------
  Decision Policy
  ---------------------------------------
  */

  status: DecisionStatus;

  requiresReview: boolean;

  margin: number;

  /*
  ---------------------------------------
  Summary
  ---------------------------------------
  */

  reason: string;

  /*
  ---------------------------------------
  Explainable AI
  ---------------------------------------
  */

  explanation: DecisionExplanation;

  /*
  ---------------------------------------
  Workflow Score
  ---------------------------------------
  */

  selectedScore: number;

  /*
  ---------------------------------------
  Next Best Action
  ---------------------------------------
  */

  nextBestAction: NextBestActionResult;

  /*
  ---------------------------------------
  Workflow Ranking
  ---------------------------------------
  */

  ranking: WorkflowScore[];

  /*
  ---------------------------------------
  Decision Context
  ---------------------------------------
  */

  decisionContext: DecisionContext;

}
