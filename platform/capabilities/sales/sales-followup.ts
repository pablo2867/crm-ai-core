import {
  skillChainExecutor,
} from "@/platform/skills/chains";

import type {
  Capability,
  CapabilityRequest,
  CapabilityResult,
} from "../types";
export const salesFollowupCapability: Capability = {

  id:
    "sales-followup",

  name:
    "Sales Follow-up",

  metadata: {

    category:
      "sales",

    priority:
      100,

    supportedIntents: [

      "sales.followup",

      "lead.followup",

      "crm.followup",

    ],

    tags: [

      "sales",

      "followup",

      "lead",

      "crm",

    ],

    modules: [

      "sales",

      "crm",

    ],

  },

  async execute(

    request: CapabilityRequest

  ): Promise<CapabilityResult> {

    const execution =
      await skillChainExecutor.execute(

        "sales-followup",

        {

          userId:
            request.userId,

          input:
            request.input,

        }

      );

    return {

      success:
        execution.success,

      message:
        execution.success
          ? "Sales Follow-up completado."
          : "Error ejecutando Sales Follow-up.",

      data:
        execution,

    };

  },

};



