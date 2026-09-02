import type { ExecutionContext } from "./execution-context";

export class ExecutionContextFactory {

  create(
    userId?: string,
    workflowId?: string,
    workflowName?: string,
    agent?: string,
    variables: Record<string, unknown> = {}
  ): ExecutionContext {

    return {

      session: {

        executionId: crypto.randomUUID(),

        workflowId,

        workflowName,

        agent,

        userId,

        startedAt: new Date(),

      },

      variables,

      state: {},

      results: {},

      metadata: {},

    };

  }

}

export const executionContextFactory =
  new ExecutionContextFactory();