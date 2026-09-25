import { supabaseAdmin } from "@/lib/supabase-admin";

export interface ConversationCommercialStateRecord {
  id: string;
  conversation_id: string;
  user_id: string;
  organization_id: string;
  workspace_id: string;
  commercial_data: Record<string, unknown>;
  opportunity_state: Record<string, unknown>;
  objections: unknown[];
  qualification: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface UpsertConversationCommercialStateRequest {
  conversationId: string;
  userId: string;
  organizationId: string;
  workspaceId: string;
  commercialData: Record<string, unknown>;
  opportunityState: Record<string, unknown>;
  objections: unknown[];
  qualification: Record<string, unknown>;
}

export class ConversationCommercialStateRepository {
  async upsert(
    request: UpsertConversationCommercialStateRequest,
  ): Promise<ConversationCommercialStateRecord> {
    const { data, error } = await supabaseAdmin
      .from("conversation_commercial_state")
      .upsert(
        {
          conversation_id: request.conversationId,
          user_id: request.userId,
          organization_id: request.organizationId,
          workspace_id: request.workspaceId,
          commercial_data: request.commercialData,
          opportunity_state: request.opportunityState,
          objections: request.objections,
          qualification: request.qualification,
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

    return data as ConversationCommercialStateRecord;
  }

  async findByConversation(
    request: {
      conversationId: string;
      userId: string;
      organizationId: string;
      workspaceId: string;
    },
  ): Promise<ConversationCommercialStateRecord | null> {
    const { data, error } = await supabaseAdmin
      .from("conversation_commercial_state")
      .select("*")
      .eq("conversation_id", request.conversationId)
      .eq("user_id", request.userId)
      .eq("organization_id", request.organizationId)
      .eq("workspace_id", request.workspaceId)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return data as ConversationCommercialStateRecord | null;
  }
}

export const conversationCommercialStateRepository =
  new ConversationCommercialStateRepository();

