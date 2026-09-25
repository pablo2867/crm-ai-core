import {
  conversationService,
} from "@/platform/services/conversations";

import type {
  BuildAIConversationContextRequest,
  AIConversationContext,
  AIConversationMessage,
} from "./types";

export class AIConversationContextBuilder {

  async build(
    request: BuildAIConversationContextRequest,
  ): Promise<AIConversationContext> {

    const limit =
      Math.min(
        Math.max(
          request.limit ?? 20,
          1,
        ),
        100,
      );

    const messages =
      await conversationService.listMessages({
        userId:
          request.userId,

        organizationId:
          request.organizationId,

        workspaceId:
          request.workspaceId,

        conversationId:
          request.conversationId,

        limit,
      });

    const contextMessages: AIConversationMessage[] =
      messages
        .filter(
          message =>
            typeof message.body === "string" &&
            message.body.trim().length > 0,
        )
        .map(
          message => ({
            role:
              message.direction === "inbound"
                ? "user"
                : "assistant",

            content:
              message.body.trim(),

            createdAt:
              message.created_at,
          }),
        );

    return {

      conversationId:
        request.conversationId,

      contactPhone:
        request.contactPhone,

      contactName:
        request.contactName ?? null,

      messages:
        contextMessages,

      messageCount:
        contextMessages.length,

    };
  }
}

export const aiConversationContextBuilder =
  new AIConversationContextBuilder();
