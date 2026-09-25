import {
  conversationMemoryRepository,
} from "@/platform/repositories/conversation-memory";

import type {
  ConversationMemoryServiceRequest,
} from "./types";

export class ConversationMemoryService {
  async get(request: ConversationMemoryServiceRequest) {
    return conversationMemoryRepository.find({
      conversationId: request.conversationId,
      userId: request.userId,
      organizationId: request.organizationId,
      workspaceId: request.workspaceId,
    });
  }

  async persist(request: ConversationMemoryServiceRequest) {
    return conversationMemoryRepository.upsert({
      conversationId: request.conversationId,
      userId: request.userId,
      organizationId: request.organizationId,
      workspaceId: request.workspaceId,
      summary: request.summary,
      facts: request.facts,
      preferences: request.preferences,
      decisions: request.decisions,
    });
  }
}

export const conversationMemoryService =
  new ConversationMemoryService();
