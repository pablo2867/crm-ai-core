import {
  eventBus,
} from "./bus";

import type {
  AIEvent,
  AIEventStatus,
} from "./types";

class EventEmitter {

  emit<T>(

    type: string,

    payload?: T,

    options?: {

      source?: string;

      status?: AIEventStatus;

      durationMs?: number;

      metadata?: Record<string, unknown>;

    }

  ): AIEvent<T> {

    const event: AIEvent<T> = {

      id: crypto.randomUUID(),

      type,

      source:
        options?.source ??
        "AI CORE",

      status:
        options?.status ??
        "completed",

      timestamp:
        new Date().toISOString(),

      durationMs:
        options?.durationMs,

      metadata:
        options?.metadata,

      payload,

    };

    eventBus.emit(event);

    return event;

  }

}

export const eventEmitter =
  new EventEmitter();