import {
  conversationLifecycleRepository,
} from "@/platform/repositories/conversation-lifecycle";

import type {
  ConversationLifecycleRecord,
  ConversationLifecycleStatus,
  FindConversationLifecycleRequest,
} from "@/platform/repositories/conversation-lifecycle";

import type {
  InitializeConversationLifecycleRequest,
  CloseConversationRequest,
  ReopenConversationRequest,
  ArchiveConversationRequest,
} from "./types";

export class ConversationLifecycleService {
  async get(
    request: FindConversationLifecycleRequest,
  ): Promise<ConversationLifecycleRecord | null> {
    return conversationLifecycleRepository.find(request);
  }

  async initialize(
    request: InitializeConversationLifecycleRequest,
  ): Promise<ConversationLifecycleRecord> {
    const now = new Date().toISOString();

    const existing =
      await conversationLifecycleRepository.find(request);

    if (existing) {
      return existing;
    }

    return conversationLifecycleRepository.upsert({
      conversationId: request.conversationId,
      userId: request.userId,
      organizationId: request.organizationId,
      workspaceId: request.workspaceId,
      status: "open",
      openedAt: request.openedAt ?? now,
      lastActivityAt:
        request.lastActivityAt ?? now,
    });
  }

  async touch(
    request: FindConversationLifecycleRequest,
  ): Promise<ConversationLifecycleRecord> {
    const now = new Date().toISOString();

    const existing =
      await conversationLifecycleRepository.find(request);

    if (!existing) {
      return this.initialize({
        ...request,
        openedAt: now,
        lastActivityAt: now,
      });
    }

    const updated =
      await conversationLifecycleRepository.update({
        ...request,
        values: {
          lastActivityAt: now,
        },
      });

    if (!updated) {
      throw new Error(
        "CONVERSATION_LIFECYCLE_NOT_FOUND",
      );
    }

    return updated;
  }

  async close(
    request: CloseConversationRequest,
  ): Promise<ConversationLifecycleRecord> {
    const now = new Date().toISOString();

    await this.initialize(request);

    const updated =
      await conversationLifecycleRepository.update({
        conversationId: request.conversationId,
        userId: request.userId,
        organizationId: request.organizationId,
        workspaceId: request.workspaceId,
        values: {
          status: "closed",
          closeReason: request.reason ?? null,
          closedBy: request.closedBy ?? null,
          closedAt: now,
          archivedAt: null,
          lastActivityAt: now,
        },
      });

    if (!updated) {
      throw new Error(
        "CONVERSATION_LIFECYCLE_NOT_FOUND",
      );
    }

    return updated;
  }

  async reopen(
    request: ReopenConversationRequest,
  ): Promise<ConversationLifecycleRecord> {
    const now = new Date().toISOString();

    await this.initialize(request);

    const updated =
      await conversationLifecycleRepository.update({
        conversationId: request.conversationId,
        userId: request.userId,
        organizationId: request.organizationId,
        workspaceId: request.workspaceId,
        values: {
          status: "open",
          closeReason: null,
          closedBy: null,
          closedAt: null,
          archivedAt: null,
          openedAt: now,
          lastActivityAt: now,
        },
      });

    if (!updated) {
      throw new Error(
        "CONVERSATION_LIFECYCLE_NOT_FOUND",
      );
    }

    return updated;
  }

  async archive(
    request: ArchiveConversationRequest,
  ): Promise<ConversationLifecycleRecord> {
    const now = new Date().toISOString();

    await this.initialize(request);

    const updated =
      await conversationLifecycleRepository.update({
        conversationId: request.conversationId,
        userId: request.userId,
        organizationId: request.organizationId,
        workspaceId: request.workspaceId,
        values: {
          status: "archived",
          closeReason: request.reason ?? null,
          archivedAt: now,
          lastActivityAt: now,
        },
      });

    if (!updated) {
      throw new Error(
        "CONVERSATION_LIFECYCLE_NOT_FOUND",
      );
    }

    return updated;
  }

  async setStatus(
    request: FindConversationLifecycleRequest & {
      status: ConversationLifecycleStatus;
    },
  ): Promise<ConversationLifecycleRecord> {
    switch (request.status) {
      case "open":
        return this.reopen(request);

      case "closed":
        return this.close(request);

      case "archived":
        return this.archive(request);

      default:
        throw new Error(
          "INVALID_CONVERSATION_LIFECYCLE_STATUS",
        );
    }
  }
}

export const conversationLifecycleService =
  new ConversationLifecycleService();
