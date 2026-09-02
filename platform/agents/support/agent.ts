import type {
  Agent,
} from "@/platform/agents/registry/types";

import type {
  AgentRequest,
  AgentResult,
} from "@/platform/agents/contracts";

class SupportAgent implements Agent {

  async execute(
    request: AgentRequest
  ): Promise<AgentResult> {

    return {

      success: true,

      data: {

        agent: "support",

        message:
          "Support Agent ejecutado correctamente.",

        request,

      },

    };

  }

}

export const supportAgent =
  new SupportAgent();