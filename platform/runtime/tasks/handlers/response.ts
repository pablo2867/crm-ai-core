import type {
  KernelResponse,
} from "@/platform/kernel";

import type {
  RuntimeTask,
  RuntimeTaskResult,
} from "../types";

import type {
  RuntimeTaskHandler,
} from "../registry";

export class ResponseTask
  implements RuntimeTaskHandler {

  id = "response";

  async execute(
    task: RuntimeTask
  ): Promise<RuntimeTaskResult> {

    const kernel =
      task.session?.state.kernel as
        | KernelResponse
        | undefined;

    if (!kernel) {

      return {

        task,

        success: false,

        output:
          "No existe resultado del Kernel para construir la respuesta.",

      };

    }

    const response = {

      handled:
        kernel.handled,

      summary:
        kernel.summary,

      decision:
        kernel.decision,

      plan:
        kernel.plan,

      workflow:
        kernel.workflow,

      validation:
        kernel.validation,

      agent:
        kernel.agent,

    };

    if (task.session) {

      task.session.state.response =
        response;

    }

    return {

      task,

      success: true,

      output:
        response,

    };

  }

}

export const responseTask =
  new ResponseTask();