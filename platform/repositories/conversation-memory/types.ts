export interface ConversationMemoryRecord {
  id: string;
  conversation_id: string;
  user_id: string;
  organization_id: string;
  workspace_id: string;
  summary: string | null;
  facts: unknown[];
  preferences: unknown[];
  decisions: unknown[];
  updated_at: string;
  created_at: string;
}

export interface FindConversationMemoryRequest {
  conversationId: string;
  userId: string;
  organizationId: string;
  workspaceId: string;
}

export interface UpsertConversationMemoryRequest {
  conversationId: string;
  userId: string;
  organizationId: string;
  workspaceId: string;
  summary?: string | null;
  facts?: unknown[];
  preferences?: unknown[];
  decisions?: unknown[];
}
