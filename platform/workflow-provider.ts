import {
  workflowRegistry,
} from "@/platform/workflows/registry";

import type {
  Workflow,
} from "@/platform/workflows/types";

/*
---------------------------------------
WORKFLOW PROVIDER
---------------------------------------

El WorkflowProvider actúa como punto de
acceso para los consumidores que necesitan
resolver un workflow por ID.

No mantiene un registro independiente.

La fuente única de verdad continúa siendo:

    WorkflowRegistry
          ↓
    WorkflowProvider
          ↓
    PlannerExecutor
          ↓
    WorkflowEngine
*/

export class WorkflowProvider {

  /*
  ---------------------------------------
  Get Workflow
  ---------------------------------------
  */

  get(
    id: string
  ): Workflow | undefined {

    return workflowRegistry.get(
      id
    );

  }

  /*
  ---------------------------------------
  Get All Workflows
  ---------------------------------------
  */

  getAll(): Workflow[] {

    return workflowRegistry.getAll();

  }

  /*
  ---------------------------------------
  Has Workflow
  ---------------------------------------
  */

  has(
    id: string
  ): boolean {

    return workflowRegistry.has(
      id
    );

  }

}

export const workflowProvider =
  new WorkflowProvider();