import type {
  RepairAction,
} from "../types";

import type {
  RepairAdapter,
  RepairAdapterContext,
  RepairAdapterResult,
} from "./types";

export const configRepairAdapter:
  RepairAdapter = {

  type:
    "config",

  canHandle(
    action: RepairAction
  ): boolean {

    return (
      action.type ===
      "config"
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
        `Config repair '${context.action.id}' está disponible pero permanece en modo seguro.`,

      rollbackAvailable:
        context.action.reversible,

      metadata: {

        safeMode:
          true,

        actionId:
          context.action.id,

      },

    };

  },

};
