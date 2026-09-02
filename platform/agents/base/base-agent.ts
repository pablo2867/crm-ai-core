import {
  agentContextBuilder,
} from "./context";

import {
  defaultAgentHooks,
} from "./hooks";

import {
  agentLogger,
} from "./logger";

import {
  agentMetrics,
} from "./metrics";

import type {
  BaseAgentRequest,
  BaseAgentResult,
  BaseAgentContext,
} from "./types";

export abstract class BaseAgent<T = unknown> {

  async execute(
    request: BaseAgentRequest
  ): Promise<BaseAgentResult<T>> {

    const startedAt =
      agentMetrics.start();

    await defaultAgentHooks.beforeExecute(
      request
    );

    const context =
      await agentContextBuilder.build(
        request
      );

    agentLogger.info(
      "Executing agent",
      {
        intent: request.intent,
      }
    );

    const data =
      await this.run(
        request,
        context
      );

    const result: BaseAgentResult<T> = {

      success: true,

      data,

      executionTime:
        agentMetrics.finish(
          startedAt
        ),

    };

    await defaultAgentHooks.afterExecute(
      result
    );

    return result;

  }

  protected abstract run(
    request: BaseAgentRequest,
    context: BaseAgentContext
  ): Promise<T>;

}