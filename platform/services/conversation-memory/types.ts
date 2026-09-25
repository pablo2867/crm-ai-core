export interface ConversationMemoryServiceRequest {
  userId: string;
  organizationId: string;
  workspaceId: string;
  conversationId: string;
  summary?: string | null;
  facts?: unknown[];
  preferences?: unknown[];
  decisions?: unknown[];
}
