import { supabaseAdmin } from "@/lib/supabase-admin";

import type {
  CreateConversationData,
  FindConversationData,
  FindConversationByPhoneData,
  ListConversationsData,
  UpdateConversationData,
  CreateMessageData,
  FindMessageData,
  ListMessagesData,
} from "./types";

export class ConversationRepository {

  async createConversation(
    data: CreateConversationData,
  ) {
    const {
      userId,
      organizationId,
      workspaceId,
      channel = "whatsapp",
      contactPhone,
      contactName = null,
      leadId = null,
      status = "open",
    } = data;

    const { data: conversation, error } =
      await supabaseAdmin
        .from("conversations")
        .insert({
          user_id: userId,
          organization_id: organizationId,
          workspace_id: workspaceId,
          channel,
          contact_phone: contactPhone,
          contact_name: contactName,
          lead_id: leadId,
          status,
        })
        .select()
        .single();

    if (error) {
      throw new Error(error.message);
    }

    return conversation;
  }

  async findConversation(
    data: FindConversationData,
  ) {
    const {
      id,
      userId,
      organizationId,
      workspaceId,
    } = data;

    const { data: conversation, error } =
      await supabaseAdmin
        .from("conversations")
        .select("*")
        .eq("id", id)
        .eq("user_id", userId)
        .eq("organization_id", organizationId)
        .eq("workspace_id", workspaceId)
        .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return conversation;
  }

  async findConversationByPhone(
    data: FindConversationByPhoneData,
  ) {
    const {
      userId,
      organizationId,
      workspaceId,
      contactPhone,
      channel = "whatsapp",
    } = data;

    const { data: conversation, error } =
      await supabaseAdmin
        .from("conversations")
        .select("*")
        .eq("user_id", userId)
        .eq("organization_id", organizationId)
        .eq("workspace_id", workspaceId)
        .eq("contact_phone", contactPhone)
        .eq("channel", channel)
        .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return conversation;
  }

  async listConversations(
    data: ListConversationsData,
  ) {
    const {
      userId,
      organizationId,
      workspaceId,
      status,
      channel,
      limit,
      offset,
    } = data;

    let query = supabaseAdmin
      .from("conversations")
      .select("*")
      .eq("user_id", userId)
      .eq("organization_id", organizationId)
      .eq("workspace_id", workspaceId)
      .order("last_message_at", {
        ascending: false,
      });

    if (status) {
      query = query.eq("status", status);
    }

    if (channel) {
      query = query.eq("channel", channel);
    }

    if (typeof limit === "number") {
      query = query.limit(limit);
    }

    if (typeof offset === "number") {
      const rangeEnd =
        typeof limit === "number"
          ? offset + limit - 1
          : offset + 99;

      query = query.range(offset, rangeEnd);
    }

    const { data: conversations, error } =
      await query;

    if (error) {
      throw new Error(error.message);
    }

    return conversations ?? [];
  }

  async updateConversation(
    data: UpdateConversationData,
  ) {
    const {
      id,
      userId,
      organizationId,
      workspaceId,
      values,
    } = data;

    const { data: conversation, error } =
      await supabaseAdmin
        .from("conversations")
        .update(values)
        .eq("id", id)
        .eq("user_id", userId)
        .eq("organization_id", organizationId)
        .eq("workspace_id", workspaceId)
        .select()
        .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return conversation;
  }

  async createMessage(
    data: CreateMessageData,
  ) {
    const {
      userId,
      organizationId,
      workspaceId,
      conversationId,
      direction,
      body,
      sender = null,
      recipient = null,
      provider = null,
      providerMessageId = null,
      status,
      metadata = {},
    } = data;

    const { data: message, error } =
      await supabaseAdmin
        .from("conversation_messages")
        .insert({
          user_id: userId,
          organization_id: organizationId,
          workspace_id: workspaceId,
          conversation_id: conversationId,
          direction,
          body,
          sender,
          recipient,
          provider,
          provider_message_id: providerMessageId,
          status:
            status ??
            (direction === "inbound"
              ? "received"
              : "queued"),
          metadata,
        })
        .select()
        .single();

    if (error) {
      throw new Error(error.message);
    }

    return message;
  }

  async findMessage(
    data: FindMessageData,
  ) {
    const {
      id,
      userId,
      organizationId,
      workspaceId,
    } = data;

    const { data: message, error } =
      await supabaseAdmin
        .from("conversation_messages")
        .select("*")
        .eq("id", id)
        .eq("user_id", userId)
        .eq("organization_id", organizationId)
        .eq("workspace_id", workspaceId)
        .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return message;
  }

  async listMessages(
    data: ListMessagesData,
  ) {
    const {
      conversationId,
      userId,
      organizationId,
      workspaceId,
      limit,
      offset,
    } = data;

    let query = supabaseAdmin
      .from("conversation_messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .eq("user_id", userId)
      .eq("organization_id", organizationId)
      .eq("workspace_id", workspaceId)
      .order("created_at", {
        ascending: true,
      });

    if (typeof limit === "number") {
      query = query.limit(limit);
    }

    if (typeof offset === "number") {
      const rangeEnd =
        typeof limit === "number"
          ? offset + limit - 1
          : offset + 99;

      query = query.range(offset, rangeEnd);
    }

    const { data: messages, error } =
      await query;

    if (error) {
      throw new Error(error.message);
    }

    return messages ?? [];
  }
}

export const conversationRepository =
  new ConversationRepository();
