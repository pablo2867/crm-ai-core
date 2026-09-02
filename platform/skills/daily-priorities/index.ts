import { getLeadDashboard } from "@/platform/services/lead-service";

import type {
  SkillDefinition,
  SkillRequest,
  SkillResult,
} from "../types";

export const dailyPrioritiesSkillDefinition: SkillDefinition = {
  id: "daily-priorities",

  name: "Daily Priorities",

  description: "Genera las prioridades comerciales del dÃ­a.",

  async execute(
    request: SkillRequest
  ): Promise<SkillResult> {
    if (!request.userId) {
      return {
        success: false,
        message: "userId requerido.",
      };
    }

    const dashboard = await getLeadDashboard(request.userId);

    return {
      success: true,
      message: "Prioridades del dÃ­a generadas correctamente.",
      data: {
        priorityLead: dashboard.bestLead,
        hotLeads: dashboard.hotLeads,
        closingCandidates: dashboard.closingCandidates,
        riskLeads: dashboard.riskLeads,
        withoutFollowup: dashboard.withoutFollowup,
        totals: dashboard.totals,
      },
    };
  },
};

export async function dailyPrioritiesSkill(
  request: SkillRequest
): Promise<SkillResult> {
  return dailyPrioritiesSkillDefinition.execute(
    request
  );
}
