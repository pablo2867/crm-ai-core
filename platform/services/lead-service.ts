import {
  supabaseAdmin,
} from "@/lib/supabase-admin";

import type {
  Lead,
} from "@/platform/domain/lead/types";

export type {
  Lead,
} from "@/platform/domain/lead/types";

export type BestLead = Lead;

export interface GetLeadsOptions {
  search?: string;
  organizationId?: string;
  workspaceId?: string;
}

const LEAD_SELECT = `
id,
user_id,
name,
company,
email,
phone,
status,
ai_score,
ai_analysis,
ai_temperature,
ai_probability,
ai_priority,
ai_followup,
ai_memory,
close_probability,
estimated_revenue,
deal_value,
pipeline_stage,
pipeline_stage_order,
created_at
`;

export async function getLeads(
  userId: string,
  options: GetLeadsOptions = {}
): Promise<Lead[]> {

  const startedAt = Date.now();
let query = supabaseAdmin
    .from("leads")
    .select(LEAD_SELECT)
    .eq("user_id", userId);

  if (options.organizationId) {
    query = query.eq(
      "organization_id",
      options.organizationId
    );
  }

  if (options.workspaceId) {
    query = query.eq(
      "workspace_id",
      options.workspaceId
    );
  }

  if (options.search?.trim()) {
    query = query.ilike(
      "name",
      `%${options.search.trim()}%`
    );
  }

  const {
    data,
    error,
  } = await query
    .order(
      "pipeline_stage_order",
      {
        ascending: true,
      }
    )
    .order(
      "created_at",
      {
        ascending: false,
      }
    );

  if (error) {
    throw error;
  }

  console.log(
    "[LEAD SERVICE TIMING] getLeads:",
    Date.now() - startedAt,
    "ms",
    "rows:",
    data?.length ?? 0
  );

  return (data ?? []) as Lead[];
}

export interface GetLeadOptions {
  organizationId?: string;
  workspaceId?: string;
}

export async function getLead(
  id: number,
  userId: string,
  options: GetLeadOptions = {}
): Promise<Lead | null> {

  let query =
    supabaseAdmin
      .from("leads")
      .select(LEAD_SELECT)
      .eq("id", id)
      .eq("user_id", userId);

  if (options.organizationId) {
    query = query.eq(
      "organization_id",
      options.organizationId
    );
  }

  if (options.workspaceId) {
    query = query.eq(
      "workspace_id",
      options.workspaceId
    );
  }

  const {
    data,
    error,
  } = await query.maybeSingle();

  if (error) {
    throw error;
  }

  return data as Lead | null;
}

export async function findBestLead(
  userId: string
): Promise<BestLead | null> {

  const leads =
    await getLeads(userId);

  if (!leads.length) {
    return null;
  }

  return [...leads].sort(
    (a, b) =>
      (b.ai_score ?? 0) -
      (a.ai_score ?? 0)
  )[0];
}

export async function getHotLeads(
  userId: string
): Promise<Lead[]> {

  const leads =
    await getLeads(userId);

  return leads
    .filter(
      (lead) =>
        (lead.ai_score ?? 0) >= 80
    )
    .sort(
      (a, b) =>
        (b.ai_score ?? 0) -
        (a.ai_score ?? 0)
    );
}

/*
---------------------------------------
Closing Candidates
---------------------------------------
Mantiene la lógica existente del CRM:
solo considera candidatos con 70% o más.
---------------------------------------
*/

export async function getClosingCandidates(
  userId: string
): Promise<Lead[]> {

  const leads =
    await getLeads(userId);

  return leads
    .filter(
      (lead) =>
        (lead.close_probability ?? 0) >= 70
    )
    .sort(
      (a, b) =>
        (b.close_probability ?? 0) -
        (a.close_probability ?? 0)
    );
}

/*
---------------------------------------
Lead Ranking
---------------------------------------
Ranking completo para AI Copilot.

No aplica el umbral de 70%.
Devuelve todos los leads que tienen
close_probability y los ordena de
mayor a menor probabilidad de cierre.
---------------------------------------
*/

export async function rankLeadsByCloseProbability(
  userId: string
): Promise<Lead[]> {

  const leads =
    await getLeads(userId);

  return leads
    .filter(
      (lead) =>
        typeof lead.close_probability === "number"
    )
    .sort(
      (a, b) =>
        (b.close_probability ?? 0) -
        (a.close_probability ?? 0)
    );
}

export async function getRiskLeads(
  userId: string
): Promise<Lead[]> {

  const leads =
    await getLeads(userId);

  return leads
    .filter(
      (lead) =>
        (lead.close_probability ?? 0) < 40
    )
    .sort(
      (a, b) =>
        (a.close_probability ?? 0) -
        (b.close_probability ?? 0)
    );
}

export async function getLeadsWithoutFollowup(
  userId: string
): Promise<Lead[]> {

  const leads =
    await getLeads(userId);

  return leads.filter(
    (lead) =>
      !lead.ai_followup ||
      lead.ai_followup.trim() === ""
  );
}

export async function getLeadDashboard(
  userId: string
) {

  const leads =
    await getLeads(userId);

  const bestLead =
    leads.length
      ? [...leads].sort(
          (a, b) =>
            (b.ai_score ?? 0) -
            (a.ai_score ?? 0)
        )[0]
      : null;

  const hotLeads =
    leads
      .filter(
        lead =>
          (lead.ai_score ?? 0) >= 80
      )
      .sort(
        (a, b) =>
          (b.ai_score ?? 0) -
          (a.ai_score ?? 0)
      );

  const closingCandidates =
    leads
      .filter(
        lead =>
          (lead.close_probability ?? 0) >= 70
      )
      .sort(
        (a, b) =>
          (b.close_probability ?? 0) -
          (a.close_probability ?? 0)
      );

  const riskLeads =
    leads
      .filter(
        lead =>
          (lead.close_probability ?? 0) < 40
      )
      .sort(
        (a, b) =>
          (a.close_probability ?? 0) -
          (b.close_probability ?? 0)
      );

  const withoutFollowup =
    leads.filter(
      lead =>
        !lead.ai_followup ||
        lead.ai_followup.trim() === ""
    );

  return {

    bestLead,

    hotLeads,

    closingCandidates,

    riskLeads,

    withoutFollowup,

    totals: {

      totalLeads:
        leads.length,

      hotLeads:
        hotLeads.length,

      closingCandidates:
        closingCandidates.length,

      riskLeads:
        riskLeads.length,

      withoutFollowup:
        withoutFollowup.length,

    },

  };

}



