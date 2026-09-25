import { supabaseAdmin } from "@/lib/supabase-admin";
import type {
  FindConversationMemoryRequest,
  UpsertConversationMemoryRequest,
} from "./types";

export class ConversationMemoryRepository {
  async find(request: FindConversationMemoryRequest) {
    const { data, error } = await supabaseAdmin
      .from("conversation_memory")
      .select("*")
      .eq("conversation_id", request.conversationId)
      .eq("user_id", request.userId)
      .eq("organization_id", request.organizationId)
      .eq("workspace_id", request.workspaceId)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async upsert(request: UpsertConversationMemoryRequest) {
    const { data, error } = await supabaseAdmin
      .from("conversation_memory")
      .upsert(
        {
          conversation_id: request.conversationId,
          user_id: request.userId,
          organization_id: request.organizationId,
          workspace_id: request.workspaceId,
          summary: request.summary ?? null,
          facts: request.facts ?? [],
          preferences: request.preferences ?? [],
          decisions: request.decisions ?? [],
        },
        {
          onConflict:
            "conversation_id,user_id,organization_id,workspace_id",
        },
      )
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }
}

export const conversationMemoryRepository =
  new ConversationMemoryRepository();
