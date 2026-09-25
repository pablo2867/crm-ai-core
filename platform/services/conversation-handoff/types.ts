import type {
  ConversationHandoffStatus,
} from "@/platform/repositories/conversation-handoff";

export interface RequestHumanHandoffRequest {
  conversationId: string;
  userId: string;
  organizationId: string;
  workspaceId: string;

  reason?: string | null;
  intent?: string | null;
  confidence?: number | null;

  metadata?: Record<string, unknown>;
}

export interface AssignHumanHandoffRequest {
  conversationId: string;
  userId: string;
  organizationId: string;
  workspaceId: string;

  assignedTo: string;
}

export interface StartHumanHandoffRequest {
  conversationId: string;
  userId: string;
  organizationId: string;
  workspaceId: string;
}

export interface ResolveHumanHandoffRequest {
  conversationId: string;
  userId: string;
  organizationId: string;
  workspaceId: string;

  resolutionNote?: string | null;
}

export interface CancelHumanHandoffRequest {
  conversationId: string;
  userId: string;
  organizationId: string;
  workspaceId: string;

  reason?: string | null;
}

export interface SetHumanHandoffStatusRequest {
  conversationId: string;
  userId: string;
  organizationId: string;
  workspaceId: string;

  status: ConversationHandoffStatus;
}
