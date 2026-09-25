import {
  commercialEventsRepository,
} from "@/platform/repositories/commercial-events";

import type {
  CommercialEvent,
} from "@/platform/repositories/commercial-events";

import type {
  TrackCommercialEventRequest,
} from "./types";

export class CommercialEventService {
  async track(
    request: TrackCommercialEventRequest,
  ): Promise<CommercialEvent> {
    if (!request.userId) {
      throw new Error("COMMERCIAL_EVENT_USER_ID_REQUIRED");
    }

    if (!request.organizationId) {
      throw new Error("COMMERCIAL_EVENT_ORGANIZATION_ID_REQUIRED");
    }

    if (!request.workspaceId) {
      throw new Error("COMMERCIAL_EVENT_WORKSPACE_ID_REQUIRED");
    }

    if (!request.eventName?.trim()) {
      throw new Error("COMMERCIAL_EVENT_NAME_REQUIRED");
    }

    return commercialEventsRepository.create({
      userId: request.userId,
      organizationId: request.organizationId,
      workspaceId: request.workspaceId,
      eventName: request.eventName.trim(),
      eventData: request.eventData ?? {},
    });
  }
}

export const commercialEventService =
  new CommercialEventService();