import {
  findBestLead,
} from "@/platform/services/lead-service";

import {
  activityService,
} from "@/platform/activity";

import {
  salesMemory,
} from "@/platform/agents/sales";

import {
  intelligenceEngine,
} from "@/platform/intelligence";

import {
  LeadIntelligenceResult,
} from "@/platform/intelligence";

export interface DecisionProviderResult {

  lead: Awaited<ReturnType<typeof findBestLead>>;

  intelligence:
    LeadIntelligenceResult | null;

  activities: unknown[];

  memory: string[];

}

export async function loadDecisionData(
  userId: string
): Promise<DecisionProviderResult> {

  const lead =
    await findBestLead(userId);

  const intelligence =
    lead
      ? intelligenceEngine.evaluateLeadRecord({
          email: lead.email,
          company: lead.company,
          ai_score: lead.ai_score,
        })
      : null;

  const activities =
    await activityService.getAll(
      userId
    );

  const memory =
    salesMemory.getHistory();

  return {

    lead,

    intelligence,

    activities,

    memory,

  };

}