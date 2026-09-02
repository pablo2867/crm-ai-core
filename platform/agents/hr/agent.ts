import type {
  Agent,
} from "@/platform/agents/registry/types";

import type {
  AgentRequest,
  AgentResult,
} from "@/platform/agents/contracts";

class HrAgent implements Agent {

  async execute(
    request: AgentRequest
  ): Promise<AgentResult> {

    return {

      success: true,

      data: {

        agent: "hr",

        message:
          "HR Agent ejecutado correctamente.",

        request,

      },

    };

  }

}

export const hrAgent =
  new HrAgent();