import {
  ActionRequest,
  ActionResult,
} from "./types";

import {
  actionWorkflowRegistry,
} from "./registry";

import {
  workflowRegistry,
  workflowEngine,
} from "@/platform/workflows";

export class ActionExecutor {

  async execute(
    request: ActionRequest
  ): Promise<ActionResult> {

    const workflowId =
      actionWorkflowRegistry[
        request.action
      ];

    if (!workflowId) {

      return {

        success: false,

        action:
          request.action,

        message:
          "No existe un workflow asociado.",

      };

    }

    const workflow =
      workflowRegistry.get(
        workflowId
      );

    if (!workflow) {

      return {

        success: false,

        action:
          request.action,

        message:
          `Workflow '${workflowId}' no encontrado.`,

      };

    }

    const workflowResult =
      await workflowEngine.execute(

        workflow,

        {

          userId:
            request.userId,

          leadId:
            request.leadId,

          ...request.payload,

        }

      );

    return {

      success:
        workflowResult.success,

      action:
        request.action,

      message:
        workflowResult.success
          ? `Workflow '${workflowId}' ejecutado correctamente.`
          : `El workflow '${workflowId}' terminó con errores.`,

      workflow:
        workflowResult,

    };

  }

}

export const actionExecutor =
  new ActionExecutor();

