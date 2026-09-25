import {
  conversationHandoffRepository,
} from "@/platform/repositories/conversation-handoff";

import type {
  ConversationHandoffRecord,
} from "@/platform/repositories/conversation-handoff";

import type {
  RequestHumanHandoffRequest,
  AssignHumanHandoffRequest,
  StartHumanHandoffRequest,
  ResolveHumanHandoffRequest,
  CancelHumanHandoffRequest,
  SetHumanHandoffStatusRequest,
} from "./types";

export class ConversationHandoffService {
  async getActive(
    request: RequestHumanHandoffRequest,
  ): Promise<ConversationHandoffRecord | null> {
    return conversationHandoffRepository.find(request);
  }

  async request(
    request: RequestHumanHandoffRequest,
  ): Promise<ConversationHandoffRecord> {
    const existing =
      await conversationHandoffRepository.find(request);

    if (existing) {
      return existing;
    }

    return conversationHandoffRepository.create(request);
  }

  async assign(
    request: AssignHumanHandoffRequest,
  ): Promise<ConversationHandoffRecord> {
    const now = new Date().toISOString();

    const updated =
      await conversationHandoffRepository.update({
        ...request,
        values: {
          status: "assigned",
          assignedTo: request.assignedTo,
          assignedAt: now,
        },
      });

    if (!updated) {
      throw new Error(
        "CONVERSATION_HANDOFF_NOT_FOUND",
      );
    }

    return updated;
  }

  async start(
    request: StartHumanHandoffRequest,
  ): Promise<ConversationHandoffRecord> {
    const now = new Date().toISOString();

    const updated =
      await conversationHandoffRepository.update({
        ...request,
        values: {
          status: "in_progress",
          startedAt: now,
        },
      });

    if (!updated) {
      throw new Error(
        "CONVERSATION_HANDOFF_NOT_FOUND",
      );
    }

    return updated;
  }

  async resolve(
    request: ResolveHumanHandoffRequest,
  ): Promise<ConversationHandoffRecord> {
    const now = new Date().toISOString();

    const updated =
      await conversationHandoffRepository.update({
        ...request,
        values: {
          status: "resolved",
          resolvedAt: now,
          resolutionNote:
            request.resolutionNote ?? null,
        },
      });

    if (!updated) {
      throw new Error(
        "CONVERSATION_HANDOFF_NOT_FOUND",
      );
    }

    return updated;
  }

  async cancel(
    request: CancelHumanHandoffRequest,
  ): Promise<ConversationHandoffRecord> {
    const updated =
      await conversationHandoffRepository.update({
        ...request,
        values: {
          status: "cancelled",
          reason: request.reason ?? null,
        },
      });

    if (!updated) {
      throw new Error(
        "CONVERSATION_HANDOFF_NOT_FOUND",
      );
    }

    return updated;
  }

  async setStatus(
    request: SetHumanHandoffStatusRequest,
  ): Promise<ConversationHandoffRecord> {
    switch (request.status) {
      case "pending":
        return this.request(request);

      case "assigned":
        throw new Error(
          "HANDOFF_ASSIGNMENT_REQUIRED",
        );

      case "in_progress":
        return this.start(request);

      case "resolved":
        return this.resolve(request);

      case "cancelled":
        return this.cancel(request);

      default:
        throw new Error(
          "INVALID_CONVERSATION_HANDOFF_STATUS",
        );
    }
  }
}

export const conversationHandoffService =
  new ConversationHandoffService();
