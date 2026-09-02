import {
  agents as agentManifest,
} from "@/platform/manifest";

import {
  salesAgent,
} from "@/platform/agents/sales";

import {
  ceoAgent,
} from "@/platform/agents/ceo";

import {
  marketingAgent,
} from "@/platform/agents/marketing";

import {
  financeAgent,
} from "@/platform/agents/finance";

import {
  supportAgent,
} from "@/platform/agents/support";

import {
  hrAgent,
} from "@/platform/agents/hr";

import type {
  Agent,
  AgentDefinition,
} from "./types";

export class AgentRegistry {

  private readonly implementations: Record<string, Agent> = {

    ceo: ceoAgent,

    sales: salesAgent,

    marketing: marketingAgent,

    finance: financeAgent,

    support: supportAgent,

    hr: hrAgent,

  };

  private readonly agents: AgentDefinition[];

  constructor() {

    this.agents = agentManifest

      .filter(
        (agent) =>

          agent.enabled &&
          this.implementations[agent.id]

      )

      .map((agent) => ({

        id: agent.id,

        name: agent.name,

        intents: agent.intents,

        agent:
          this.implementations[agent.id],

      }));

  }

  findByIntent(
    intent: string
  ): AgentDefinition | undefined {

    return this.agents.find(

      (agent) =>

        agent.intents.includes(
          intent
        )

    );

  }

  getById(
    id: string
  ): AgentDefinition | undefined {

    return this.agents.find(

      (agent) =>

        agent.id === id

    );

  }

  getAll(): AgentDefinition[] {

    return [...this.agents];

  }

}

export const agentRegistry =
  new AgentRegistry();