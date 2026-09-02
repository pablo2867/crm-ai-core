import {
  runtimeEvents,
} from "./events";

import {
  eventEmitter,
} from "@/platform/events";

class RuntimeEventBridge {

  private initialized = false;

  initialize() {

    if (this.initialized) {

      return;

    }

    this.initialized = true;

    runtimeEvents.on(

      (event) => {

        const status =
          event.endsWith("completed")
            ? "completed"
            : event.endsWith("started")
            ? "running"
            : event.endsWith("failed")
            ? "failed"
            : "completed";

        eventEmitter.emit(

          event,

          undefined,

          {

            source:
              "RuntimeEngine",

            status,

          },

        );

      },

    );

  }

}

export const runtimeEventBridge =
  new RuntimeEventBridge();