import {
  findBestLead,
} from "@/platform/services/lead-service";

import type {
  SkillDefinition,
  SkillRequest,
  SkillResult,
} from "../types";

interface FindBestLeadInput {

  limit?: number;

}

export const findBestLeadSkillDefinition: SkillDefinition = {

  id: "find-best-lead",

  name: "Find Best Lead",

  description:
    "Obtiene el lead con mayor score.",

  async execute(
    request: SkillRequest
  ): Promise<SkillResult> {

    if (!request.userId) {

      return {

        success: false,

        message:
          "userId requerido.",

      };

    }

    const inputLead =
      request.input?.lead;

    const lead =
      inputLead &&
      typeof inputLead === "object"
        ? inputLead
        : await findBestLead(
            request.userId
          );

    return {

      success: true,

      message:
        lead
          ? "Lead encontrado."
          : "No existen leads.",

      data: {

        bestLead: lead,

        input:
          request.input as
            FindBestLeadInput,

      },

    };

  },

};

export async function findBestLeadSkill(

  request: SkillRequest

): Promise<SkillResult> {

  return findBestLeadSkillDefinition.execute(
    request
  );

}


