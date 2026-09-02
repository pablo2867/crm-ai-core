import type { ExecutionContext } from "./execution-context";
import type { ExecutionResult } from "./execution-result";

export class ExecutionRuntime {

  async run<T>(

    callback: (
      context: ExecutionContext
    ) => Promise<T>,

    context: ExecutionContext

  ): Promise<ExecutionResult<T | null>> {

    const startedAt = Date.now();

    try {

      const data = await callback(context);

      return {

        success: true,

        data,

        executionId:
          context.session.executionId,

        durationMs:
          Date.now() - startedAt,

      };

    } catch (error) {

      return {

        success: false,

        data: null,

        executionId:
          context.session.executionId,

        durationMs:
          Date.now() - startedAt,

        warnings: [

          error instanceof Error
            ? error.message
            : "Unknown execution error",

        ],

      };

    }

  }

}

export const executionRuntime =
  new ExecutionRuntime();