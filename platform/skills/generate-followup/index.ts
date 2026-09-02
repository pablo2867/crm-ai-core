import {
  generateFollowup,
} from "@/platform/services/followup-service";

 import {
  aiUsageEngine,
} from "@/platform/billing/usage";

import type {
  SkillDefinition,
  SkillRequest,
  SkillResult,
} from "../types";

interface BestLead {

  id: number;

  name: string;

  company?: string | null;

  email?: string | null;

}

interface GenerateFollowupInput {

  name?: string;

  company?: string;

  email?: string;

  bestLead?: BestLead;

}

export const generateFollowupSkillDefinition:
  SkillDefinition = {

  id:
    "generate-followup",

  name:
    "Generate Follow-up",

  description:
    "Genera un follow-up comercial mediante IA.",

  async execute(

    request: SkillRequest

  ): Promise<SkillResult> {

    if (
      request.organizationId &&
      request.userId
    ) {

      const usage =
        await aiUsageEngine.checkFollowup({

          organizationId:
            request.organizationId,

          userId:
            request.userId,

          workflow:
            "sales-followup",

          skill:
            "generate-followup",

          status:
            "success",

          since:
            new Date(
              new Date().getFullYear(),
              new Date().getMonth(),
              1
            ),

        });

      console.log(
        "[GENERATE FOLLOWUP USAGE]",
        usage
      );

      if (!usage.allowed) {

        return {
          success: false,
          message:
            usage.reason ??
            "AI_FOLLOWUP_LIMIT_REACHED",
          data: {
            usage: usage.usage,
            limit: usage.limit,
            plan: usage.plan,
          },
        };

      }

    }

    const input =
      (
        request.input ??
        {}
      ) as GenerateFollowupInput;

    const lead =
      input.bestLead;

    const followup =
      await generateFollowup({

        name:
          input.name ??
          lead?.name ??
          "Cliente",

        company:
          input.company ??
          lead?.company ??
          undefined,

        email:
          input.email ??
          lead?.email ??
          undefined,

      });

    return {

      success:
        true,

      message:
        "Follow-up generado.",

      data: {

        followup,

      },

    };

  },

};

export async function generateFollowupSkill(

  request: SkillRequest

): Promise<SkillResult> {

  return generateFollowupSkillDefinition.execute(
    request
  );

}
