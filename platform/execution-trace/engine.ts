import {
  buildExecutionTrace,
  TraceStepInput,
} from "./builder";

import type {
  ExecutionTrace,
} from "./types";

export class ExecutionTraceEngine {

  create(

    requestId: string,

    steps: TraceStepInput[]

  ): ExecutionTrace {

    return buildExecutionTrace(

      requestId,

      steps

    );

  }

  append(

    trace: ExecutionTrace,

    step: TraceStepInput

  ): ExecutionTrace {

    const now =
      new Date().toISOString();

    return {

      ...trace,

      steps: [

        ...trace.steps,

        {

          stage:
            step.stage,

          success:
            step.success ?? true,

          startedAt:
            now,

          finishedAt:
            now,

          durationMs:
            step.durationMs ?? 0,

          message:
            step.message,

        },

      ],

    };

  }

}

export const executionTraceEngine =
  new ExecutionTraceEngine();
  