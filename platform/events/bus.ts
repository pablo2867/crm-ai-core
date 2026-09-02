import {
  AIEvent,
  EventHandler,
} from "./types";

class EventBus {
  private handlers = new Map<
    string,
    EventHandler[]
  >();

  on(
    eventType: string,
    handler: EventHandler
  ) {
    const handlers =
      this.handlers.get(eventType) || [];

    handlers.push(handler);

    this.handlers.set(
      eventType,
      handlers
    );
  }

  emit(event: AIEvent) {
    const handlers =
      this.handlers.get(event.type);

    if (!handlers) {
      return;
    }

    handlers.forEach((handler) =>
      handler(event)
    );
  }
}

export const eventBus =
  new EventBus();