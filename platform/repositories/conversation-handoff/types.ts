export type ConversationHandoffStatus =
  | "pending"
  | "assigned"
  | "in_progress"
  | "resolved"
  | "cancelled";

export interface ConversationHandoffRecord {
  id: string;
  conversationId: string;
  userId: string;
  organizationId: string;
  workspaceId: string;

  status: ConversationHandoffStatus;

  reason: string | null;
  intent: string | null;
  confidence: number | null;

  assignedTo: string | null;
  assignedAt: string | null;

  requestedAt: string;
  startedAt: string | null;
  resolvedAt: string | null;

  resolutionNote: string | null;

  metadata: Record<string, unknown>;

  createdAt: string;
  updatedAt: string;
}

export interface FindConversationHandoffRequest {
  conversationId: string;
  userId: string;
  organizationId: string;
  workspaceId: string;
}

export interface CreateConversationHandoffRequest {
  conversationId: string;
  userId: string;
  organizationId: string;
  workspaceId: string;

  reason?: string | null;
  intent?: string | null;
  confidence?: number | null;

  metadata?: Record<string, unknown>;
}

export interface UpdateConversationHandoffRequest
  extends FindConversationHandoffRequest {
  values: {
    status?: ConversationHandoffStatus;
    reason?: string | null;
    assignedTo?: string | null;
    assignedAt?: string | null;
    startedAt?: string | null;
    resolvedAt?: string | null;
    resolutionNote?: string | null;
    metadata?: Record<string, unknown>;
  };
}
