import {
  Workflow,
} from "@/platform/workflows";

export interface WorkflowMatchRequest {
  intent: string;
  workflows: Workflow[];
}

export function matchWorkflows(
  request: WorkflowMatchRequest
): Workflow[] {

  return request.workflows.filter((workflow) => {

    const metadata = workflow.metadata;

    if (!metadata) {
      return false;
    }

    if (!metadata.enabled) {
      return false;
    }

    return metadata.supportedIntents.includes(
      request.intent
    );

  });

}