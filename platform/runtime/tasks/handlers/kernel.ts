import {
  aiKernel,
} from "@/platform/kernel";

import type {
  RuntimeTask,
  RuntimeTaskResult,
} from "../types";

import type {
  RuntimeTaskHandler,
} from "../registry";

export class KernelTask
  implements RuntimeTaskHandler {

  id = "kernel";

  async execute(

    task: RuntimeTask

  ): Promise<RuntimeTaskResult> {

    const payload =
      task.payload ?? {};

    const result =
      await aiKernel.execute({

        /*
        ---------------------------------------
        Solicitud principal
        ---------------------------------------
        */

        message:
          String(
            payload.message ?? ""
          ),

        intent:
          String(
            payload.intent ?? "generic"
          ),

        /*
        ---------------------------------------
        Identidad
        ---------------------------------------
        */

        userId:
          typeof payload.userId === "string"
            ? payload.userId
            : undefined,

        leadId:
          typeof payload.leadId === "number"
            ? payload.leadId
            : undefined,

        /*
        ---------------------------------------
        Multi Tenant
        ---------------------------------------
        */

        organizationId:
          typeof payload.organizationId === "string"
            ? payload.organizationId
            : undefined,

        workspaceId:
          typeof payload.workspaceId === "string"
            ? payload.workspaceId
            : undefined,

        moduleId:
          typeof payload.moduleId === "string"
            ? payload.moduleId
            : undefined,

        /*
        ---------------------------------------
        Contexto
        ---------------------------------------
        */

        context:
          typeof payload.context === "object" &&
          payload.context !== null
            ? (
                payload.context as Record<
                  string,
                  unknown
                >
              )
            : {},

      });

    return {

      task,

      success: true,

      output:
        result,

    };

  }

}

export const kernelTask =
  new KernelTask();