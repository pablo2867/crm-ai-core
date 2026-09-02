import {
  generateEmail,
} from "@/platform/services/email-service";

import type {
  SkillDefinition,
  SkillRequest,
  SkillResult,
} from "../types";

interface GenerateEmailInput {

  subject?: string;

  objective?: string;

  audience?: string;

  company?: string;

}

export const generateEmailSkillDefinition: SkillDefinition = {

  id: "generate-email",

  name: "Generate Email",

  description:
    "Genera un email de marketing mediante IA.",

  async execute(
    request: SkillRequest
  ): Promise<SkillResult> {

    const input =
      (request.input ?? {}) as GenerateEmailInput;

    const email =
      await generateEmail({

        subject:
          input.subject,

        objective:
          input.objective,

        audience:
          input.audience,

        company:
          input.company,

      });

    return {

      success: true,

      message:
        "Email generado.",

      data: {

        email,

      },

    };

  },

};

export async function generateEmailSkill(

  request: SkillRequest

): Promise<SkillResult> {

  return generateEmailSkillDefinition.execute(
    request
  );

}