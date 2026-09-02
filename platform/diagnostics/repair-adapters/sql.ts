import type {
  RepairAction,
} from "../types";

import type {
  RepairAdapter,
  RepairAdapterContext,
  RepairAdapterResult,
} from "./types";

export const sqlRepairAdapter:
  RepairAdapter = {

  type:
    "sql",

  canHandle(
    action: RepairAction
  ): boolean {

    return (
      action.type ===
      "sql"
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
        `SQL repair '${context.action.id}' requiere aprobación explícita y permanece bloqueado.`,

      rollbackAvailable:
        context.action.reversible,

      metadata: {

        executionBlocked:
          true,

        requiresApproval:
          true,

        actionId:
          context.action.id,

      },

    };

  },

};
