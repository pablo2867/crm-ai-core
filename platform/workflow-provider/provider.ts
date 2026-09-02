import {
  moduleManager,
} from "@/platform/modules";

import {
  workflowRegistry,
} from "@/platform/workflows/registry";

import type {
  Workflow,
} from "@/platform/workflows/types";

export class WorkflowProvider {

  getAll(): Workflow[] {

    /*
    ---------------------------------------
    Module Workflows
    ---------------------------------------
    */

    const moduleWorkflowIds =

      moduleManager
        .getModules()
        .flatMap(
          module => module.workflows
        );

    /*
    ---------------------------------------
    Registry Workflows
    ---------------------------------------
    */

    const registryWorkflows =
      workflowRegistry.getAll();

    /*
    ---------------------------------------
    Resolve Module Workflows
    ---------------------------------------
    */

    const moduleWorkflows =
      moduleWorkflowIds
        .map(
          workflow =>
            workflowRegistry.get(
              workflow.id
            )
        )
        .filter(
          (
            workflow
          ): workflow is Workflow =>
            workflow !== undefined
        );

    /*
    ---------------------------------------
    Merge
    ---------------------------------------
    */

    const unique =
      new Map<string, Workflow>();

    for (const workflow of [
      ...moduleWorkflows,
      ...registryWorkflows,
    ]) {

      unique.set(
        workflow.id,
        workflow
      );

    }

    return [
      ...unique.values(),
    ];

  }

  get(
    id: string
  ): Workflow | undefined {

    return this
      .getAll()
      .find(
        workflow =>
          workflow.id === id
      );

  }

}

export const workflowProvider =
  new WorkflowProvider();