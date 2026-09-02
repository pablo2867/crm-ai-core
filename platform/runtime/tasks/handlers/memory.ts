import {
  memoryEngine,
} from "@/platform/memory";

import type {
  RuntimeTask,
  RuntimeTaskResult,
} from "../types";

import type {
  RuntimeTaskHandler,
} from "../registry";

export class MemoryTask
  implements RuntimeTaskHandler {

  id = "memory";

  async execute(
    task: RuntimeTask
  ): Promise<RuntimeTaskResult> {

    const payload =
      task.payload ?? {};

    const userId =
      typeof payload.userId === "string"
        ? payload.userId
        : "";

    if (!userId) {

      return {

        task,

        success: false,

        output:
          "No se recibió userId.",

      };

    }

    const memory =
      await memoryEngine.recall({

        userId,

        limit: 10,

      });

    if (task.session) {

      task.session.state.memory =
        memory;

    }

    return {

      task,

      success: true,

      output:
        memory,

    };

  }

}

export const memoryTask =
  new MemoryTask();
