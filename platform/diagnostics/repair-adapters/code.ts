import type {
  RepairAction,
} from "../types";

import type {
  RepairAdapter,
  RepairAdapterContext,
  RepairAdapterResult,
} from "./types";

export const codeRepairAdapter:
  RepairAdapter = {

  type:
    "code",

  canHandle(
    action: RepairAction
  ): boolean {

    return (
      action.type ===
      "code"
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
        `Code repair '${context.action.id}' requiere aprobación explícita y permanece bloqueado.`,

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
