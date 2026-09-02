import {
  contextEngine,
} from "@/platform/context";

import type {
  RuntimeTask,
  RuntimeTaskResult,
} from "../types";

import type {
  RuntimeTaskHandler,
} from "../registry";

export class ContextTask
  implements RuntimeTaskHandler {

  id = "context";

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

    /*
    ---------------------------------------
    Construir contexto
    ---------------------------------------
    */

    const context =
      await contextEngine.build(
        userId
      );

    /*
    ---------------------------------------
    Compartir contexto
    ---------------------------------------
    */

    if (task.session) {

      task.session.state.context =
        context;

    }

    return {

      task,

      success: true,

      output:
        context,

    };

  }

}

export const contextTask =
  new ContextTask();
