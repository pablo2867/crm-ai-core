import type {
  RuntimeRequest,
} from "../../types";

import type {
  RuntimePipeline,
} from "../types";

export function buildDefaultPipeline(
  request: RuntimeRequest
): RuntimePipeline {

  return [

    /*
    ---------------------------------------
    Context
    ---------------------------------------
    */

    {
      id: "context",

      name: "Load Context",

      payload: {

        userId:
          request.userId,

      },

    },

    /*
    ---------------------------------------
    Memory
    ---------------------------------------
    */

    {
      id: "memory",

      name: "Recall Memory",

      payload: {

        userId:
          request.userId,

      },

    },

    /*
    ---------------------------------------
    Kernel
    ---------------------------------------
    */

    {
      id: "kernel",

      name: "Execute Kernel",

      payload: {

        message:
          request.message,

        intent:
          request.intent,

        userId:
          request.userId,

        leadId:
          request.leadId,

        organizationId:
          request.organizationId,

        workspaceId:
          request.workspaceId,

        moduleId:
          request.moduleId,

        context:
          request.context,

      },

    },

    /*
    ---------------------------------------
    Response
    ---------------------------------------
    */

    {
      id: "response",

      name: "Build Response",

    },

  ];

}