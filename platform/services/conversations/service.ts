import {
  conversationRepository,
} from "@/platform/repositories/conversation";

import type {
  CreateConversationRequest,
  CreateMessageRequest,
  FindConversationRequest,
  FindConversationByPhoneRequest,
  ListConversationsRequest,
  ListMessagesRequest,
  UpdateConversationRequest,
} from "./types";

export class ConversationService {

  async createConversation(
    request: CreateConversationRequest,
  ) {
    const existing =
      await conversationRepository.findConversationByPhone({
        userId: request.userId,
        organizationId: request.organizationId,
        workspaceId: request.workspaceId,
        contactPhone: request.contactPhone,
        channel: request.channel ?? "whatsapp",
      });

    if (existing) {
      return existing;
    }

    return conversationRepository.createConversation({
      ...request,
      channel: request.channel ?? "whatsapp",
    });
  }

  async findConversation(
    request: FindConversationRequest,
  ) {
    return conversationRepository.findConversation(
      request,
    );
  }

  async findConversationByPhone(
    request: FindConversationByPhoneRequest,
  ) {
    return conversationRepository.findConversationByPhone(
      request,
    );
  }

  async listConversations(
    request: ListConversationsRequest,
  ) {
    return conversationRepository.listConversations(
      request,
    );
  }

  async updateConversation(
    request: UpdateConversationRequest,
  ) {
    return conversationRepository.updateConversation(
      request,
    );
  }

  async addMessage(
    request: CreateMessageRequest,
  ) {
    const conversation =
      await conversationRepository.findConversation({
        id: request.conversationId,
        userId: request.userId,
        organizationId: request.organizationId,
        workspaceId: request.workspaceId,
      });

    if (!conversation) {
      throw new Error(
        "CONVERSATION_NOT_FOUND",
      );
    }

    const message =
      await conversationRepository.createMessage(
        request,
      );

    await conversationRepository.updateConversation({
      id: request.conversationId,
      userId: request.userId,
      organizationId: request.organizationId,
      workspaceId: request.workspaceId,
      values: {
        last_message_at:
          new Date().toISOString(),
      },
    });

    return message;
  }

  async listMessages(
    request: ListMessagesRequest,
  ) {
    const conversation =
      await conversationRepository.findConversation({
        id: request.conversationId,
        userId: request.userId,
        organizationId: request.organizationId,
        workspaceId: request.workspaceId,
      });

    if (!conversation) {
      throw new Error(
        "CONVERSATION_NOT_FOUND",
      );
    }

    return conversationRepository.listMessages(
      request,
    );
  }
}

export const conversationService =
  new ConversationService();
