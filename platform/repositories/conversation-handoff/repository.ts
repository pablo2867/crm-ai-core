import { supabaseAdmin } from "@/lib/supabase-admin";

import type {
  ConversationHandoffRecord,
  FindConversationHandoffRequest,
  CreateConversationHandoffRequest,
  UpdateConversationHandoffRequest,
} from "./types";

type ConversationHandoffRow = {
  id: string;
  conversation_id: string;
  user_id: string;
  organization_id: string;
  workspace_id: string;
  status: ConversationHandoffRecord["status"];
  reason: string | null;
  intent: string | null;
  confidence: number | string | null;
  assigned_to: string | null;
  assigned_at: string | null;
  requested_at: string;
  started_at: string | null;
  resolved_at: string | null;
  resolution_note: string | null;
  metadata: unknown;
  created_at: string;
  updated_at: string;
};

function mapRecord(
  row: ConversationHandoffRow,
): ConversationHandoffRecord {
  return {
    id: row.id,
    conversationId: row.conversation_id,
    userId: row.user_id,
    organizationId: row.organization_id,
    workspaceId: row.workspace_id,
    status: row.status,
    reason: row.reason ?? null,
    intent: row.intent ?? null,
    confidence:
      typeof row.confidence === "number"
        ? row.confidence
        : row.confidence !== null
          ? Number(row.confidence)
          : null,
    assignedTo: row.assigned_to ?? null,
    assignedAt: row.assigned_at ?? null,
    requestedAt: row.requested_at,
    startedAt: row.started_at ?? null,
    resolvedAt: row.resolved_at ?? null,
    resolutionNote: row.resolution_note ?? null,
    metadata:
      row.metadata &&
      typeof row.metadata === "object"
        ? (row.metadata as Record<string, unknown>)
        : {},
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export class ConversationHandoffRepository {
  async find(
    request: FindConversationHandoffRequest,
  ): Promise<ConversationHandoffRecord | null> {
    const { data, error } = await supabaseAdmin
      .from("conversation_handoffs")
      .select("*")
      .eq("conversation_id", request.conversationId)
      .eq("user_id", request.userId)
      .eq("organization_id", request.organizationId)
      .eq("workspace_id", request.workspaceId)
      .in("status", ["pending", "assigned", "in_progress"])
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw new Error(error.message);

    return data
      ? mapRecord(data as ConversationHandoffRow)
      : null;
  }

  async create(
    request: CreateConversationHandoffRequest,
  ): Promise<ConversationHandoffRecord> {
    const { data, error } = await supabaseAdmin
      .from("conversation_handoffs")
      .insert({
        conversation_id: request.conversationId,
        user_id: request.userId,
        organization_id: request.organizationId,
        workspace_id: request.workspaceId,
        status: "pending",
        reason: request.reason ?? null,
        intent: request.intent ?? null,
        confidence: request.confidence ?? null,
        metadata: request.metadata ?? {},
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    return mapRecord(data as ConversationHandoffRow);
  }

  async update(
    request: UpdateConversationHandoffRequest,
  ): Promise<ConversationHandoffRecord | null> {
    const values: Record<string, unknown> = {};

    if (request.values.status !== undefined) {
      values.status = request.values.status;
    }
    if (request.values.reason !== undefined) {
      values.reason = request.values.reason;
    }
    if (request.values.assignedTo !== undefined) {
      values.assigned_to = request.values.assignedTo;
    }
    if (request.values.assignedAt !== undefined) {
      values.assigned_at = request.values.assignedAt;
    }
    if (request.values.startedAt !== undefined) {
      values.started_at = request.values.startedAt;
    }
    if (request.values.resolvedAt !== undefined) {
      values.resolved_at = request.values.resolvedAt;
    }
    if (request.values.resolutionNote !== undefined) {
      values.resolution_note = request.values.resolutionNote;
    }
    if (request.values.metadata !== undefined) {
      values.metadata = request.values.metadata;
    }

    const { data, error } = await supabaseAdmin
      .from("conversation_handoffs")
      .update(values)
      .eq("conversation_id", request.conversationId)
      .eq("user_id", request.userId)
      .eq("organization_id", request.organizationId)
      .eq("workspace_id", request.workspaceId)
      .in("status", ["pending", "assigned", "in_progress"])
      .order("created_at", { ascending: false })
      .limit(1)
      .select()
      .maybeSingle();

    if (error) throw new Error(error.message);

    return data
      ? mapRecord(data as ConversationHandoffRow)
      : null;
  }
}

export const conversationHandoffRepository =
  new ConversationHandoffRepository();

