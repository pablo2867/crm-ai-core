import type {
  Campaign,
  CampaignExecutionResult,
} from "./types";

import {
  workflowEngine,
} from "@/platform/workflows/engine";

import {
  workflowRegistry,
} from "@/platform/workflows/registry";

export class CampaignEngine {

  async execute(

    campaign: Campaign

  ): Promise<CampaignExecutionResult> {

    const workflow =
      workflowRegistry.get(
        "marketing-campaign"
      );

    if (!workflow) {

      return {

        success: false,

        campaignId:
          campaign.id,

        executedChannels: [],

        message:
          "Workflow 'marketing-campaign' no encontrado.",

      };

    }

    const workflowResult =
      await workflowEngine.execute(

        workflow,

        {

          campaign,

        }

      );

    const message =
      workflowResult.execution.length > 0
        ? workflowResult.execution
            .map(step => step.message)
            .join(" | ")
        : workflowResult.success
          ? "Campaña ejecutada correctamente."
          : "La campaña finalizó con errores.";

    return {

      success:
        workflowResult.success,

      campaignId:
        campaign.id,

      executedChannels:

        campaign.channels

          .filter(
            channel => channel.enabled
          )

          .map(
            channel => channel.channel
          ),

      message,

    };

  }

}

export const campaignEngine =
  new CampaignEngine();