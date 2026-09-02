import type {
  Workflow,
} from "@/platform/workflows";

export interface PriorityScore {

  score: number;

  reason: string;

}

export function scorePriority(

  workflow: Workflow

): PriorityScore {

  const priority =
    workflow.metadata?.priority ?? 0;

  const score =
    Math.min(
      Math.max(
        priority / 5,
        0
      ),
      20
    );

  return {

    score,

    reason:
      `Prioridad del workflow: ${priority}`,

  };

}
