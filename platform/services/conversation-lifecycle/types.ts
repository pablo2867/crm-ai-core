import type {
  ConversationLifecycleStatus,
} from "@/platform/repositories/conversation-lifecycle";

export interface InitializeConversationLifecycleRequest {
  conversationId: string;
  userId: string;
  organizationId: string;
  workspaceId: string;
  openedAt?: string;
  lastActivityAt?: string;
}

export interface CloseConversationRequest {
  conversationId: string;
  userId: string;
  organizationId: string;
  workspaceId: string;
  reason?: string | null;
  closedBy?: string | null;
}

export interface ReopenConversationRequest {
  conversationId: string;
  userId: string;
  organizationId: string;
  workspaceId: string;
  reason?: string | null;
}

export interface ArchiveConversationRequest {
  conversationId: string;
  userId: string;
  organizationId: string;
  workspaceId: string;
  reason?: string | null;
}

export interface SetConversationStatusRequest {
  conversationId: string;
  userId: string;
  organizationId: string;
  workspaceId: string;
  status: ConversationLifecycleStatus;
}
