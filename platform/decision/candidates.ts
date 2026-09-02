import {
  workflowRegistry,
} from "@/platform/workflows";

import type {
  Workflow,
} from "@/platform/workflows/types";

import type {
  DecisionRequest,
} from "./types";

import {
  matchWorkflows,
} from "./matcher";

export function getWorkflowCandidates(
  request: DecisionRequest
): Workflow[] {

  const workflows =
    workflowRegistry.getAll();

  return matchWorkflows({

    intent:
      request.intent,

    workflows,

  });

}
