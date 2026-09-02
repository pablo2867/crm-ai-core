import {
  workflowExecutor,
} from "./executor";

import {
  Workflow,
  WorkflowContext,
} from "./types";

export class WorkflowEngine {

  async execute(

    workflow: Workflow,

    context: WorkflowContext = {}

  ) {

    return await workflowExecutor.execute(

      workflow,

      context

    );

  }

}

export const workflowEngine =
  new WorkflowEngine();