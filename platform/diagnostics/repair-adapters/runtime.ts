import type {
  RepairAction,
} from "../types";

import type {
  RepairAdapter,
  RepairAdapterContext,
  RepairAdapterResult,
} from "./types";

export const runtimeRepairAdapter:
  RepairAdapter = {

  type:
    "runtime",

  canHandle(
    action: RepairAction
  ): boolean {

    return (
      action.type ===
      "runtime"
    );

  },

  async execute(
    context: RepairAdapterContext
  ): Promise<RepairAdapterResult> {

    return {

      success:
        false,

      executed:
        false,

      message:
        `Runtime repair '${context.action.id}' está disponible pero permanece en modo seguro.`,

      rollbackAvailable:
        context.action.reversible,

      metadata: {

        safeMode:
          true,

        actionId:
          context.action.id,

        userId:
          context.userId,

        organizationId:
          context.organizationId,

        workspaceId:
          context.workspaceId,

      },

    };

  },

};

