import type {
  AIContext,
} from "./types";

import {
  loadLeads,
} from "./providers";

import {
  businessContextBuilder,
} from "./business";

export async function buildContext(
  userId: string,
  organizationId?: string,
  workspaceId?: string
): Promise<AIContext> {

  const leads =
    await loadLeads(
      userId,
      organizationId,
      workspaceId
    );

  const business =
    await businessContextBuilder.build(
      leads
    );

  const bestLead =
    [...leads]
      .sort(
        (a, b) => {

          const scoreA =
            Number(a.ai_score ?? 0) +
            Number(a.close_probability ?? 0);

          const scoreB =
            Number(b.ai_score ?? 0) +
            Number(b.close_probability ?? 0);

          return scoreB - scoreA;

        }
      )[0];

  return {

    user: {

      id:
        userId,

      organizationId:
        organizationId,

      workspaceId:
        workspaceId,

    },

    leads,

    bestLead,

    activities: [],

    reminders: [],

    business,

    metadata: {

      generatedAt:
        new Date().toISOString(),

    },

  };

}


