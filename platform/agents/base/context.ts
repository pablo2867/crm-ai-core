import type {
  BaseAgentContext,
  BaseAgentRequest,
} from "./types";

export class AgentContextBuilder {

  async build(
    request: BaseAgentRequest
  ): Promise<BaseAgentContext> {

    return {

      userId:
        request.userId,

      metadata:
        request.context,

      memory: [],

    };

  }

}

export const agentContextBuilder =
  new AgentContextBuilder();