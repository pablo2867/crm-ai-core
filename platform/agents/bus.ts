import {
  agentRegistry,
} from "./registry";

import type {
  AgentRequest,
  AgentResult,
} from "@/platform/agents/contracts";

import type {
  AgentDefinition,
} from "./registry/types";

export class AgentBus {

  getAgentByIntent(
    intent: string
  ): AgentDefinition {

    const agent =
      agentRegistry.findByIntent(intent);

    if (!agent) {
      throw new Error(
        `No agent registered for intent "${intent}".`
      );
    }

    return agent;
  }

  async execute(
    intent: string,
    request: AgentRequest
  ): Promise<AgentResult> {

    const agent =
      this.getAgentByIntent(intent);

    return await agent.agent.execute(request);

  }

  hasIntent(
    intent: string
  ): boolean {

    return (
      agentRegistry.findByIntent(intent) !==
      undefined
    );

  }

  getAvailableAgents() {

    return agentRegistry.getAll();

  }

}

export const agentBus =
  new AgentBus();