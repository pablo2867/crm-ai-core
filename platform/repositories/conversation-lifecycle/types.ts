export type ConversationLifecycleStatus =
  | "open"
  | "closed"
  | "archived";

export type ConversationLifecycleActorType =
  | "system"
  | "user"
  | "ai";

export interface ConversationLifecycleRecord {
  id: string;
  conversationId: string;
  userId: string;
  organizationId: string;
  workspaceId: string;
  status: ConversationLifecycleStatus;
  closeReason: string | null;
  closedBy: string | null;
  openedAt: string | null;
  closedAt: string | null;
  archivedAt: string | null;
  lastActivityAt: string | null;
  updatedAt: string;
  createdAt: string;
}

export interface FindConversationLifecycleRequest {
  conversationId: string;
  userId: string;
  organizationId: string;
  workspaceId: string;
}

export interface UpsertConversationLifecycleRequest {
  conversationId: string;
  userId: string;
  organizationId: string;
  workspaceId: string;
  status?: ConversationLifecycleStatus;
  closeReason?: string | null;
  closedBy?: string | null;
  openedAt?: string | null;
  closedAt?: string | null;
  archivedAt?: string | null;
  lastActivityAt?: string | null;
}

export interface UpdateConversationLifecycleRequest
  extends FindConversationLifecycleRequest {
  values: Partial<{
    status: ConversationLifecycleStatus;
    closeReason: string | null;
    closedBy: string | null;
    openedAt: string | null;
    closedAt: string | null;
    archivedAt: string | null;
    lastActivityAt: string | null;
  }>;
}
