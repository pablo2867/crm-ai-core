import {
  supabaseAdmin,
} from "@/lib/supabase-admin";

import type {
  MemoryRecord,
  RememberRequest,
} from "./types";

function toMemoryRecord(
  row: Record<string, unknown>
): MemoryRecord {

  return {

    id:
      typeof row.id === "string"
        ? row.id
        : undefined,

    userId:
      row.user_id as string,

    organizationId:
      row.organization_id as string,

    workspaceId:
      row.workspace_id as string,

    type:
      row.memory_type as string,

    title:
      row.title as string,

    content:
      row.content as string,

    metadata:
      (row.metadata as Record<string, unknown> | null)
      ?? undefined,

    createdAt:
      row.created_at as string,

  };

}

export async function storeMemory(
  request: RememberRequest
): Promise<void> {

  if (
    !request.organizationId ||
    !request.workspaceId
  ) {

    throw new Error(
      "MEMORY_TENANT_CONTEXT_REQUIRED"
    );

  }

  const {
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

      memory_type:
        request.type,

      title:
        request.title,

      content:
        request.content,

      metadata:
        request.metadata ?? {},

    });

  if (error) {

    throw new Error(
      `MEMORY_STORAGE_ERROR: ${error.message}`
    );

  }

}

export async function getMemories(
  userId: string,
  organizationId?: string,
  workspaceId?: string
): Promise<MemoryRecord[]> {

  let query =
    supabaseAdmin

      .from("ai_memory")

      .select("*")

      .eq(
        "user_id",
        userId
      )

      .order(
        "created_at",
        {
          ascending: false,
        }
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
    data,
    error,
  } = await query;

  if (error) {

    throw new Error(
      `MEMORY_RETRIEVAL_ERROR: ${error.message}`
    );

  }

  return (
    (data ?? []) as Record<string, unknown>[]
  ).map(
    toMemoryRecord
  );

}
