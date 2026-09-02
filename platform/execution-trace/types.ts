export type ExecutionStage =

  | "context"
  | "memory"
  | "decision"
  | "validation"
  | "planner"
  | "workflow"
  | "orchestrator"
  | "summary";

export interface ExecutionTraceStep {

  stage: ExecutionStage;

  success: boolean;

  startedAt: string;

  finishedAt: string;

  durationMs: number;

  message?: string;

}

export interface ExecutionTrace {

  id: string;

  requestId: string;

  createdAt: string;

  steps: ExecutionTraceStep[];

}