import type {
  Capability,
  CapabilityRequest,
  CapabilityResult,
} from "../types";

export const dailyBriefCapability: Capability = {

  id: "daily-brief",

  name: "Executive Daily Brief",

  async execute(

    request: CapabilityRequest

  ): Promise<CapabilityResult> {

    return {

      success: true,

      message:
        "Daily Brief disponible.",

      data: {

        generatedAt:
          new Date().toISOString(),

        userId:
          request.userId,

      },

    };

  },

};