export interface AIConversationMessage {
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export interface AIConversationContext {
  conversationId: string;
  contactPhone: string;
  contactName?: string | null;
  messages: AIConversationMessage[];
  messageCount: number;
}

export interface BuildAIConversationContextRequest {
  userId: string;
  organizationId: string;
  workspaceId: string;
  conversationId: string;
  contactPhone: string;
  contactName?: string | null;
  limit?: number;
}
