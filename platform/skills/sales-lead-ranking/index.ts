import {
  rankLeadsByCloseProbability,
} from "@/platform/services/lead-service";

import type {
  Lead,
} from "@/platform/domain/lead/types";

import type {
  SkillDefinition,
  SkillRequest,
  SkillResult,
} from "../types";

export interface SalesLeadRankingResult {
  leads: Lead[];
  total: number;
}

export const salesLeadRankingSkillDefinition:
  SkillDefinition = {

  id:
    "sales-lead-ranking",

  name:
    "Sales Lead Ranking",

  description:
    "Obtiene los leads ordenados por probabilidad de cierre, de mayor a menor.",

  async execute(
    request: SkillRequest
  ): Promise<
    SkillResult<SalesLeadRankingResult>
  > {

    if (!request.userId) {

      return {

        success:
          false,

        message:
          "No se recibió un usuario válido.",

        error:
          "USER_ID_REQUIRED",

      };

    }

    try {

      const leads =
        await rankLeadsByCloseProbability(
          request.userId
        );

      return {

        success:
          true,

        message:
          leads.length
            ? `Se encontraron ${leads.length} leads ordenados por probabilidad de cierre.`
            : "No se encontraron leads con probabilidad de cierre disponible.",

        data: {

          leads,

          total:
            leads.length,

        },

      };

    } catch (error) {

      return {

        success:
          false,

        message:
          "No fue posible obtener el ranking de leads.",

        error:
          error instanceof Error
            ? error.message
            : "LEAD_RANKING_ERROR",

      };

    }

  },

};
