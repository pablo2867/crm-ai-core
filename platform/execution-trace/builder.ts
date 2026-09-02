import type {
  ExecutionTrace,
  ExecutionTraceStep,
  ExecutionStage,
} from "./types";

export interface TraceStepInput {

  stage: ExecutionStage;

  success?: boolean;

  durationMs?: number;

  message?: string;

}

export function buildExecutionTrace(

  requestId: string,

  steps: TraceStepInput[]

): ExecutionTrace {

  const createdAt =
    new Date().toISOString();

  const executionSteps: ExecutionTraceStep[] =
    steps.map(step => ({

      stage:
        step.stage,

      success:
        step.success ?? true,

      startedAt:
        createdAt,

      finishedAt:
        createdAt,

      durationMs:
        step.durationMs ?? 0,

      message:
        step.message,

    }));

  return {

    id:
      crypto.randomUUID(),

    requestId,

    createdAt,

    steps:
      executionSteps,

  };

}