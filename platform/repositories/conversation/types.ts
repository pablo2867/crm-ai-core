export interface ConversationTenantContext {
  userId: string;
  organizationId: string;
  workspaceId: string;
}

export type ConversationChannel = "whatsapp";

export type ConversationStatus =
  | "open"
  | "closed"
  | "archived";

export type MessageDirection =
  | "inbound"
  | "outbound";

export type MessageStatus =
  | "queued"
  | "sent"
  | "delivered"
  | "read"
  | "failed"
  | "received";

export interface CreateConversationData
  extends ConversationTenantContext {
  channel?: ConversationChannel;
  contactPhone: string;
  contactName?: string | null;
  leadId?: number | null;
  status?: ConversationStatus;
}

export interface FindConversationData
  extends ConversationTenantContext {
  id: string;
}

export interface FindConversationByPhoneData
  extends ConversationTenantContext {
  contactPhone: string;
  channel?: ConversationChannel;
}

export interface ListConversationsData
  extends ConversationTenantContext {
  status?: ConversationStatus;
  channel?: ConversationChannel;
  limit?: number;
  offset?: number;
}

export interface UpdateConversationData
  extends ConversationTenantContext {
  id: string;
  values: Record<string, unknown>;
}

export interface CreateMessageData
  extends ConversationTenantContext {
  conversationId: string;
  direction: MessageDirection;
  body: string;
  sender?: string | null;
  recipient?: string | null;
  provider?: string | null;
  providerMessageId?: string | null;
  status?: MessageStatus;
  metadata?: Record<string, unknown>;
}

export interface FindMessageData
  extends ConversationTenantContext {
  id: string;
}

export interface ListMessagesData
  extends ConversationTenantContext {
  conversationId: string;
  limit?: number;
  offset?: number;
}
