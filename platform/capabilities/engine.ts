import {
  capabilityProvider,
} from "@/platform/capability-provider";

import {
  activityService,
} from "@/platform/activity";

import {
  selectCapabilityForRequest,
} from "./selector";

import type {
  Capability,
  CapabilityRequest,
  CapabilityResult,
} from "./types";

/*
---------------------------------------
ACTIVITY DATA SERIALIZATION
---------------------------------------

Las capabilities pueden devolver objetos
con referencias circulares.

Activity Runtime necesita datos que puedan
ser serializados por Supabase/PostgREST.

Esta función protege únicamente el registro
de Activity. No modifica el resultado real
de la capability.
*/

function serializeActivityData(
  value: unknown
): unknown {

  if (
    value === null ||
    value === undefined
  ) {

    return value;

  }

  try {

    return JSON.parse(
      JSON.stringify(
        value
      )
    );

  } catch {

    return {
      serializationError:
        "Activity data could not be serialized.",
    };

  }

}

/*
---------------------------------------
ERROR HELPERS
---------------------------------------
*/

function getErrorMessage(
  error: unknown
): string {

  if (error instanceof Error) {

    return error.message;

  }

  if (typeof error === "string") {

    return error;

  }

  try {

    return JSON.stringify(
      error
    );

  } catch {

    return "Unknown capability execution error.";

  }

}

function getErrorStack(
  error: unknown
): string | undefined {

  if (error instanceof Error) {

    return error.stack;

  }

  return undefined;

}

export class CapabilityEngine {

  /*
  ---------------------------------------
  Legacy API
  ---------------------------------------
  */

  getCapability(
    id: string
  ): Capability | undefined {

    return capabilityProvider.get(
      id
    );

  }

  /*
  ---------------------------------------
  Execute by ID
  ---------------------------------------
  */

  async execute(

    id: string,

    request: CapabilityRequest

  ): Promise<CapabilityResult> {

    const capability =
      this.getCapability(
        id
      );

    /*
    ---------------------------------------
    CAPABILITY NOT FOUND
    ---------------------------------------
    */

    if (!capability) {

      console.error(
        "[AUTHORITY TRACE] CAPABILITY NOT FOUND",
        JSON.stringify({
          capabilityId:
            id,

          workflowId:
            request.workflowId,

          intent:
            request.intent,
        })
      );

      return {

        success: false,

        message:
          `Capability '${id}' no encontrada.`,

      };

    }

    /*
    ---------------------------------------
    CAPABILITY START
    ---------------------------------------
    */

    console.log(
      "[AUTHORITY TRACE] CAPABILITY START",
      JSON.stringify({

        capabilityId:
          id,

        capabilityName:
          capability.name,

        workflowId:
          request.workflowId,

        intent:
          request.intent,

        organizationId:
          request.organizationId,

        workspaceId:
          request.workspaceId,

        userId:
          request.userId,

      })
    );

    const startedAt =
      Date.now();

    let result: CapabilityResult;

    /*
    ---------------------------------------
    CAPABILITY EXECUTION
    ---------------------------------------
    */

    try {

      result =
        await capability.execute(
          request
        );

    } catch (error) {

      const durationMs =
        Date.now() -
        startedAt;

      console.error(
        "[AUTHORITY TRACE] CAPABILITY EXECUTION ERROR",
        {

          capabilityId:
            id,

          capabilityName:
            capability.name,

          workflowId:
            request.workflowId,

          intent:
            request.intent,

          organizationId:
            request.organizationId,

          workspaceId:
            request.workspaceId,

          userId:
            request.userId,

          error:
            getErrorMessage(
              error
            ),

          stack:
            getErrorStack(
              error
            ),

          durationMs,

        }
      );

      return {

        success: false,

        message:
          `Capability '${id}' falló durante la ejecución: ${getErrorMessage(error)}`,

      };

    }

    const durationMs =
      Date.now() -
      startedAt;

    /*
    ---------------------------------------
    CAPABILITY RESULT
    ---------------------------------------
    */

    console.log(
      "[AUTHORITY TRACE] CAPABILITY RESULT",
      JSON.stringify({

        capabilityId:
          id,

        workflowId:
          request.workflowId,

        intent:
          request.intent,

        success:
          result.success,

        message:
          result.message,

        durationMs,

      })
    );

    /*
    ---------------------------------------
    Activity Runtime Integration
    ---------------------------------------
    */

    if (request.userId) {

      try {

        await activityService.add({

          id:
            crypto.randomUUID(),

          userId:
            request.userId,

          organizationId:
            request.organizationId!,

          workspaceId:
            request.workspaceId!,

          workflow:
            request.workflowId ??
            id,

          skill:
            id,

          status:
            result.success
              ? "success"
              : "error",

          message:
            result.message,

          createdAt:
            new Date(),

          durationMs,

          data:
            serializeActivityData(
              result.data
            ),

        });

      } catch (error) {

        /*
        ---------------------------------------
        ACTIVITY ERROR
        ---------------------------------------

        Un fallo de Activity Runtime no debe
        destruir el resultado de la capability.
        */

        console.error(
          "[AUTHORITY TRACE] ACTIVITY REGISTRATION ERROR",
          {

            capabilityId:
              id,

            workflowId:
              request.workflowId,

            userId:
              request.userId,

            organizationId:
              request.organizationId,

            workspaceId:
              request.workspaceId,

            error:
              getErrorMessage(
                error
              ),

            stack:
              getErrorStack(
                error
              ),

          }
        );

      }

    }

    /*
    ---------------------------------------
    RETURN CAPABILITY RESULT
    ---------------------------------------
    */

    return result;

  }

  /*
  ---------------------------------------
  Intelligent Selection
  ---------------------------------------
  */

  async selectAndExecute(

    request: CapabilityRequest

  ): Promise<CapabilityResult> {

    const selection =
      await selectCapabilityForRequest(
        request
      );

    console.log(
      "[AUTHORITY TRACE] CAPABILITY SELECTION",
      JSON.stringify({

        capabilityId:
          selection.capability.id,

        capabilityName:
          selection.capability.name,

        workflowId:
          request.workflowId,

        intent:
          request.intent,

      })
    );

    return this.execute(

      selection.capability.id,

      request

    );

  }

}

export const capabilityEngine =
  new CapabilityEngine();
