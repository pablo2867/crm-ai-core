import { supabaseAdmin } from "@/lib/supabase-admin";

import type {
  ConversationLifecycleRecord,
  FindConversationLifecycleRequest,
  UpsertConversationLifecycleRequest,
  UpdateConversationLifecycleRequest,
} from "./types";

function mapRecord(
  row: Record<string, unknown>,
): ConversationLifecycleRecord {
  return {
    id: String(row.id),
    conversationId: String(row.conversation_id),
    userId: String(row.user_id),
    organizationId: String(row.organization_id),
    workspaceId: String(row.workspace_id),
    status: row.status as ConversationLifecycleRecord["status"],
    closeReason:
      typeof row.close_reason === "string"
        ? row.close_reason
        : null,
    closedBy:
      typeof row.closed_by === "string"
        ? row.closed_by
        : null,
    openedAt:
      typeof row.opened_at === "string"
        ? row.opened_at
        : null,
    closedAt:
      typeof row.closed_at === "string"
        ? row.closed_at
        : null,
    archivedAt:
      typeof row.archived_at === "string"
        ? row.archived_at
        : null,
    lastActivityAt:
      typeof row.last_activity_at === "string"
        ? row.last_activity_at
        : null,
    updatedAt: String(row.updated_at),
    createdAt: String(row.created_at),
  };
}

export class ConversationLifecycleRepository {
  async find(
    request: FindConversationLifecycleRequest,
  ): Promise<ConversationLifecycleRecord | null> {
    const { data, error } = await supabaseAdmin
      .from("conversation_lifecycle")
      .select("*")
      .eq("conversation_id", request.conversationId)
      .eq("user_id", request.userId)
      .eq("organization_id", request.organizationId)
      .eq("workspace_id", request.workspaceId)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return data
      ? mapRecord(data as Record<string, unknown>)
      : null;
  }

  async upsert(
    request: UpsertConversationLifecycleRequest,
  ): Promise<ConversationLifecycleRecord> {
    const { data, error } = await supabaseAdmin
      .from("conversation_lifecycle")
      .upsert(
        {
          conversation_id: request.conversationId,
          user_id: request.userId,
          organization_id: request.organizationId,
          workspace_id: request.workspaceId,
          status: request.status ?? "open",
          close_reason: request.closeReason ?? null,
          closed_by: request.closedBy ?? null,
          opened_at: request.openedAt ?? null,
          closed_at: request.closedAt ?? null,
          archived_at: request.archivedAt ?? null,
          last_activity_at:
            request.lastActivityAt ?? null,
        },
        {
          onConflict:
            "conversation_id,user_id,organization_id,workspace_id",
        },
      )
      .select("*")
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return mapRecord(data as Record<string, unknown>);
  }

  async update(
    request: UpdateConversationLifecycleRequest,
  ): Promise<ConversationLifecycleRecord | null> {
    const { data, error } = await supabaseAdmin
      .from("conversation_lifecycle")
      .update({
        ...(request.values.status !== undefined && {
          status: request.values.status,
        }),
        ...(request.values.closeReason !== undefined && {
          close_reason: request.values.closeReason,
        }),
        ...(request.values.closedBy !== undefined && {
          closed_by: request.values.closedBy,
        }),
        ...(request.values.openedAt !== undefined && {
          opened_at: request.values.openedAt,
        }),
        ...(request.values.closedAt !== undefined && {
          closed_at: request.values.closedAt,
        }),
        ...(request.values.archivedAt !== undefined && {
          archived_at: request.values.archivedAt,
        }),
        ...(request.values.lastActivityAt !== undefined && {
          last_activity_at: request.values.lastActivityAt,
        }),
      })
      .eq("conversation_id", request.conversationId)
      .eq("user_id", request.userId)
      .eq("organization_id", request.organizationId)
      .eq("workspace_id", request.workspaceId)
      .select("*")
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return data
      ? mapRecord(data as Record<string, unknown>)
      : null;
  }
}

export const conversationLifecycleRepository =
  new ConversationLifecycleRepository();
