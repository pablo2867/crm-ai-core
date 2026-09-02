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

    if (!capability) {

      return {

        success: false,

        message:
          `Capability '${id}' no encontrada.`,

      };

    }

    const startedAt =
      Date.now();

    const result =
      await capability.execute(
        request
      );

    const durationMs =
      Date.now() -
      startedAt;

    /*
    ---------------------------------------
    Activity Runtime Integration
    ---------------------------------------
    */

    if (request.userId) {

      await activityService.add({

        id:
          crypto.randomUUID(),

        userId:
          request.userId,

        
        organizationId:
          request.organizationId!,

        workspaceId:
          request.workspaceId!,workflow:
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

    }

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

    return this.execute(

      selection.capability.id,

      request

    );

  }

}

export const capabilityEngine =
  new CapabilityEngine();

