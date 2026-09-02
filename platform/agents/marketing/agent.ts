import type {
  AgentRequest,
  AgentResult,
} from "@/platform/agents/contracts";

import {
  marketingPlanner,
} from "./planner";

import {
  campaignEngine,
} from "@/platform/campaign/engine";

import type {
  Campaign,
} from "@/platform/campaign/types";

import {
  resolveIntent,
} from "@/platform/copilot/intent-resolver";

export interface MarketingAgentResponse {

  recommendations: string[];

  campaignExecuted: boolean;

}

export class MarketingAgent {

  async execute(

    request: AgentRequest

  ): Promise<
    AgentResult<MarketingAgentResponse>
  > {

    const intent =
      resolveIntent(
        request.message
      );

    if (!intent) {

      return {

        success: false,

        data: {

          recommendations: [

            "No fue posible identificar la intención del usuario."

          ],

          campaignExecuted: false,

        },

      };

    }

    const plan =
      await marketingPlanner.createPlan(

        request.message,

        intent,

        request.userId,

        request.context

      );

    const campaign: Campaign = {

      id: crypto.randomUUID(),

      name: "Campaña IA",

      objective: plan.objective,

      status: "planned",

      audience: {

        name: "General",

      },

      channels: [

        {

          channel: "email",

          enabled: true,

        },

      ],

      content: {},

      createdAt: new Date(),

      updatedAt: new Date(),

    };

    const execution =
      await campaignEngine.execute(
        campaign
      );

    return {

      success:
        execution.success,

      data: {

        recommendations: [

          "Campaña preparada",

          `Workflow: ${plan.workflow.name}`,

          execution.message,

        ],

        campaignExecuted:
          execution.success,

      },

    };

  }

}

export const marketingAgent =
  new MarketingAgent();