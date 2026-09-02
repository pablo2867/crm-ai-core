import {
  agentRegistry,
} from "@/platform/agents/registry";

import type {
  AgentRequest,
  AgentResult,
} from "@/platform/agents/contracts";

import type {
  AgentDefinition,
} from "@/platform/agents/registry/types";

export interface DispatchResult
  extends AgentResult {

  agent: string;

}

export class AgentDispatcher {

  private resolveAgent(
    intent: string
  ): AgentDefinition | undefined {

    return agentRegistry.findByIntent(
      intent
    );

  }

  protected async beforeDispatch(
    _request: AgentRequest
  ): Promise<void> {

    // Futuro:
    // Logging
    // Hooks
    // Validation
    // Security

  }

  protected async afterDispatch(
    _request: AgentRequest,
    _result: AgentResult
  ): Promise<void> {

    // Futuro:
    // Metrics
    // Runtime History
    // Memory
    // Executive Analytics

  }

  protected async onError(
    error: unknown
  ): Promise<DispatchResult> {

    return {

      success: false,

      agent: "dispatcher",

      data: {

        message:
          error instanceof Error
            ? error.message
            : "Unknown dispatcher error",

      },

    };

  }

  async dispatch(
    request: AgentRequest
  ): Promise<DispatchResult> {

    try {

      await this.beforeDispatch(
        request
      );

      const agent =
        this.resolveAgent(
          request.intent
        );

      if (!agent) {

        return {

          success: false,

          agent: "none",

          data: {

            message:
              `No agent registered for intent '${request.intent}'.`,

          },

        };

      }

      const result =
        await agent.agent.execute(
          request
        );

      await this.afterDispatch(
        request,
        result
      );

      return {

        success:
          result.success,

        agent:
          agent.id,

        data:
          result.data,

      };

    } catch (error) {

      return this.onError(
        error
      );

    }

  }

}

export const agentDispatcher =
  new AgentDispatcher();