import {
  aiConversationRuntime,
  type GenerateConversationResponseResult,
} from "@/platform/ai/conversation";

import type {
  ConversationDecision,
} from "./decision";

export interface GenerateDecidedConversationResponseRequest {
  userId: string;
  organizationId: string;
  workspaceId: string;
  conversationId: string;
  contactPhone: string;
  contactName?: string | null;
  message: string;
  limit?: number;
  decision: ConversationDecision;
}

export interface GenerateDecidedConversationResponseResult
  extends GenerateConversationResponseResult {
  decision: ConversationDecision;
}

export class AIConversationResponseEngine {
  async generate(
    request: GenerateDecidedConversationResponseRequest,
  ): Promise<GenerateDecidedConversationResponseResult> {

    const response =
      await aiConversationRuntime.generateResponse({
        userId: request.userId,
        organizationId: request.organizationId,
        workspaceId: request.workspaceId,
        conversationId: request.conversationId,
        contactPhone: request.contactPhone,
        contactName: request.contactName,
        message: request.message,
        limit: request.limit,
      });

    return {
      ...response,
      decision: request.decision,
    };
  }
}

export const aiConversationResponseEngine =
  new AIConversationResponseEngine();
