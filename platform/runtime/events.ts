export type RuntimeEventHandler = (

  event: string

) => void;

export class RuntimeEvents {

  private listeners =
    new Set<RuntimeEventHandler>();

  private history: string[] = [];

  emit(
    event: string
  ) {

    this.history.push(event);

    for (

      const listener of
      this.listeners

    ) {

      listener(event);

    }

  }

  on(
    handler: RuntimeEventHandler
  ) {

    this.listeners.add(handler);

  }

  off(
    handler: RuntimeEventHandler
  ) {

    this.listeners.delete(handler);

  }

  clear() {

    this.history = [];

  }

  getHistory() {

    return [...this.history];

  }

}

export const runtimeEvents =
  new RuntimeEvents();