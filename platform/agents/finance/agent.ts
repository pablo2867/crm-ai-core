import {
  financeService,
} from "@/platform/services/finance";

import type {
  Agent,
} from "@/platform/agents/registry/types";

import type {
  AgentRequest,
  AgentResult,
} from "@/platform/agents/contracts";

class FinanceAgent implements Agent {

  async execute(
    request: AgentRequest
  ): Promise<AgentResult> {

    if (!request.userId) {

      return {

        success: false,

        data: {

          message:
            "No se recibió el userId.",

        },

      };

    }

    const finance =
      await financeService.get(
        request.userId
      );

    return {

      success: true,

      data: {

        agent: "finance",

        summary: finance,

      },

    };

  }

}

export const financeAgent =
  new FinanceAgent();