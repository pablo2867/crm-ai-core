import {
  supabaseAdmin,
} from "@/lib/supabase-admin";

import type {
  ContextLead,
} from "./types";

export async function loadLeads(
  userId: string,
  organizationId?: string,
  workspaceId?: string
): Promise<ContextLead[]> {

  let query =
    supabaseAdmin
      .from("leads")
      .select(`
        id,
        name,
        company,
        status,
        pipeline_stage,
        ai_score,
        ai_temperature,
        estimated_revenue,
        close_probability
      `)
      .eq(
        "user_id",
        userId
      );

  if (organizationId) {

    query = query.eq(
      "organization_id",
      organizationId
    );

  }

  if (workspaceId) {

    query = query.eq(
      "workspace_id",
      workspaceId
    );

  }

  const {
    data,
    error,
  } = await query;

  if (error) {

    console.error(
      "CONTEXT LOAD LEADS ERROR:",
      error
    );

    return [];

  }

  return (data ?? []) as ContextLead[];

}
