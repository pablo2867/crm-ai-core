import type {
  ConversationChannel,
  ConversationStatus,
  MessageDirection,
  MessageStatus,
} from "@/platform/repositories/conversation/types";

export interface CreateConversationRequest {
  userId: string;
  organizationId: string;
  workspaceId: string;
  channel?: ConversationChannel;
  contactPhone: string;
  contactName?: string | null;
  leadId?: number | null;
  status?: ConversationStatus;
}

export interface CreateMessageRequest {
  userId: string;
  organizationId: string;
  workspaceId: string;
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

export interface FindConversationRequest {
  userId: string;
  organizationId: string;
  workspaceId: string;
  id: string;
}

export interface FindConversationByPhoneRequest {
  userId: string;
  organizationId: string;
  workspaceId: string;
  contactPhone: string;
  channel?: ConversationChannel;
}

export interface ListConversationsRequest {
  userId: string;
  organizationId: string;
  workspaceId: string;
  status?: ConversationStatus;
  channel?: ConversationChannel;
  limit?: number;
  offset?: number;
}

export interface ListMessagesRequest {
  userId: string;
  organizationId: string;
  workspaceId: string;
  conversationId: string;
  limit?: number;
  offset?: number;
}

export interface UpdateConversationRequest {
  userId: string;
  organizationId: string;
  workspaceId: string;
  id: string;
  values: Record<string, unknown>;
}
