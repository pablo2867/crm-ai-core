import {
  supabaseAdmin,
} from "@/lib/supabase-admin";

import type {
  ExecutiveMemoryRecord,
  MemorySearchOptions,
  SaveMemoryRequest,
} from "./types";

function toExecutiveMemoryRecord(
  row: Record<string, unknown>
): ExecutiveMemoryRecord {

  return {

    id:
      row.id as string,

    userId:
      row.user_id as string,

    organizationId:
      row.organization_id as string,

    workspaceId:
      row.workspace_id as string,

    leadId:
      typeof row.lead_id === "number"
        ? row.lead_id
        : undefined,

    workflow:
      row.workflow as string | undefined,

    skill:
      row.skill as string | undefined,

    summary:
      row.content as string,

    recommendation:
      row.recommendation as string | undefined,

    priority:
      (row.priority as ExecutiveMemoryRecord["priority"])
      ?? "MEDIUM",

    metadata:
      (row.metadata as Record<string, unknown> | null)
      ?? undefined,

    createdAt:
      row.created_at as string,

  };

}

export class ExecutiveMemoryStore {

  async save(
    request: SaveMemoryRequest
  ): Promise<ExecutiveMemoryRecord> {

    if (
      !request.organizationId ||
      !request.workspaceId
    ) {

      throw new Error(
        "EXECUTIVE_MEMORY_TENANT_CONTEXT_REQUIRED"
      );

    }

    const {
      data,
      error,
    } = await supabaseAdmin

      .from("ai_memory")

      .insert({

        user_id:
          request.userId,

        organization_id:
          request.organizationId,

        workspace_id:
          request.workspaceId,

        lead_id:
          request.leadId ?? null,

        memory_type:
          "executive",

        workflow:
          request.workflow ?? null,

        skill:
          request.skill ?? null,

        title:
          request.workflow
            ? `Executive Memory - ${request.workflow}`
            : "Executive Memory",

        content:
          request.summary,

        recommendation:
          request.recommendation ?? null,

        priority:
          request.priority ?? "MEDIUM",

        metadata:
          request.metadata ?? {},

      })

      .select("*")

      .single();

    if (error) {

      throw new Error(
        `EXECUTIVE_MEMORY_STORAGE_ERROR: ${error.message}`
      );

    }

    return toExecutiveMemoryRecord(
      data as Record<string, unknown>
    );

  }

  async search(
    options: MemorySearchOptions
  ): Promise<ExecutiveMemoryRecord[]> {

    let query =
      supabaseAdmin

        .from("ai_memory")

        .select("*")

        .eq(
          "user_id",
          options.userId
        )

        .eq(
          "memory_type",
          "executive"
        )

        .order(
          "created_at",
          {
            ascending: false,
          }
        );

    if (options.organizationId) {

      query =
        query.eq(
          "organization_id",
          options.organizationId
        );

    }

    if (options.workspaceId) {

      query =
        query.eq(
          "workspace_id",
          options.workspaceId
        );

    }

    if (
      options.leadId !==
      undefined
    ) {

      query =
        query.eq(
          "lead_id",
          options.leadId
        );

    }

    if (options.workflow) {

      query =
        query.eq(
          "workflow",
          options.workflow
        );

    }

    if (options.skill) {

      query =
        query.eq(
          "skill",
          options.skill
        );

    }

    const {
      data,
      error,
    } = await query.limit(
      options.limit ?? 20
    );

    if (error) {

      throw new Error(
        `EXECUTIVE_MEMORY_SEARCH_ERROR: ${error.message}`
      );

    }

    return (
      (data ?? []) as Record<string, unknown>[]
    ).map(
      toExecutiveMemoryRecord
    );

  }

  async latest(
    userId: string,
    organizationId?: string,
    workspaceId?: string
  ): Promise<ExecutiveMemoryRecord | null> {

    let query =
      supabaseAdmin

        .from("ai_memory")

        .select("*")

        .eq(
          "user_id",
          userId
        )

        .eq(
          "memory_type",
          "executive"
        )

        .order(
          "created_at",
          {
            ascending: false,
          }
        )

        .limit(1);

    if (organizationId) {

      query =
        query.eq(
          "organization_id",
          organizationId
        );

    }

    if (workspaceId) {

      query =
        query.eq(
          "workspace_id",
          workspaceId
        );

    }

    const {
      data,
      error,
    } = await query.maybeSingle();

    if (error) {

      throw new Error(
        `EXECUTIVE_MEMORY_LATEST_ERROR: ${error.message}`
      );

    }

    if (!data) {

      return null;

    }

    return toExecutiveMemoryRecord(
      data as Record<string, unknown>
    );

  }

  async clear(
    userId: string,
    organizationId?: string,
    workspaceId?: string
  ): Promise<void> {

    let query =
      supabaseAdmin

        .from("ai_memory")

        .delete()

        .eq(
          "user_id",
          userId
        )

        .eq(
          "memory_type",
          "executive"
        );

    if (organizationId) {

      query =
        query.eq(
          "organization_id",
          organizationId
        );

    }

    if (workspaceId) {

      query =
        query.eq(
          "workspace_id",
          workspaceId
        );

    }

    const {
      error,
    } = await query;

    if (error) {

      throw new Error(
        `EXECUTIVE_MEMORY_CLEAR_ERROR: ${error.message}`
      );

    }

  }

}

export const executiveMemoryStore =
  new ExecutiveMemoryStore();
