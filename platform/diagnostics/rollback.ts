import type {
  RepairAction,
} from "./types";

export interface RollbackAction {

  actionId: string;

  description: string;

  reversible: boolean;

}

export interface RollbackResult {

  success: boolean;

  status:
    | "completed"
    | "partial"
    | "blocked";

  message: string;

  actions: RollbackAction[];

  revertedActions: string[];

  blockedActions: string[];

}

export class RollbackManager {

  async prepare(
    actions: RepairAction[]
  ): Promise<RollbackResult> {

    const rollbackActions:
      RollbackAction[] = [];

    const blockedActions:
      string[] = [];

    for (const action of actions) {

      if (!action.reversible) {

        blockedActions.push(
          action.id
        );

        continue;

      }

      rollbackActions.push({

        actionId:
          action.id,

        description:
          `Revertir: ${action.description}`,

        reversible:
          true,

      });

    }

    if (
      rollbackActions.length === 0
    ) {

      return {

        success:
          false,

        status:
          "blocked",

        message:
          "No existen acciones reversibles disponibles para rollback.",

        actions:
          [],

        revertedActions:
          [],

        blockedActions,

      };

    }

    /*
    ------------------------------------------------
    SAFE ROLLBACK MODE
    ------------------------------------------------

    La primera versión prepara el rollback.

    NO modifica:

    - archivos
    - base de datos
    - configuración
    - runtime

    La ejecución física se incorporará mediante
    ejecutores especializados.
    ------------------------------------------------
    */

    return {

      success:
        true,

      status:
        "completed",

      message:
        "Rollback preparado correctamente en modo seguro.",

      actions:
        rollbackActions,

      revertedActions:
        [],

      blockedActions,

    };

  }

}

export const rollbackManager =
  new RollbackManager();
