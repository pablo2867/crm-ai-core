import type {
  RuntimeTask,
  RuntimeTaskResult,
} from "../types";

import type {
  RuntimeTaskHandler,
} from "./types";

import {
  contextTask,
  kernelTask,
  memoryTask,
  responseTask,
} from "../handlers";

export class RuntimeTaskRegistry {

  private handlers =
    new Map<
      string,
      RuntimeTaskHandler
    >();

  register(
    handler: RuntimeTaskHandler
  ) {

    this.handlers.set(
      handler.id,
      handler
    );

  }

  has(
    id: string
  ) {

    return this.handlers.has(id);

  }

  async execute(
    task: RuntimeTask
  ): Promise<RuntimeTaskResult> {

    const handler =
      this.handlers.get(
        task.id
      );

    if (!handler) {

      return {

        task,

        success: false,

        output:
          `Task '${task.id}' no registrada.`,

      };

    }

    return handler.execute(
      task
    );

  }

}

export const runtimeTaskRegistry =
  new RuntimeTaskRegistry();

/*
---------------------------------------
Registro automático de Tasks
---------------------------------------
*/

runtimeTaskRegistry.register(
  contextTask
);

runtimeTaskRegistry.register(
  memoryTask
);

runtimeTaskRegistry.register(
  kernelTask
);

runtimeTaskRegistry.register(
  responseTask
);
