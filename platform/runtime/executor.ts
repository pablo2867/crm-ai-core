import {
  aiKernel,
} from "@/platform/kernel";

import type {
  RuntimeRequest,
} from "./types";

export async function executeRuntime(

  request: RuntimeRequest

) {

  return aiKernel.execute({

    /*
    ---------------------------------------
    Solicitud principal
    ---------------------------------------
    */

    message:
      request.message,

    intent:
      request.intent,

    /*
    ---------------------------------------
    Identidad
    ---------------------------------------
    */

    userId:
      request.userId,

    leadId:
      request.leadId,

    /*
    ---------------------------------------
    Multi Tenant
    ---------------------------------------
    */

    organizationId:
      request.organizationId,

    workspaceId:
      request.workspaceId,

    moduleId:
      request.moduleId,

    /*
    ---------------------------------------
    Contexto
    ---------------------------------------
    */

    context:
      request.context,

  });

}