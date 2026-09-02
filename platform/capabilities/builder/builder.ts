import type {
  CapabilityContext,
  CapabilityContextInput,
} from "./types";

export function buildCapabilityContext(
  input: CapabilityContextInput
): CapabilityContext {

  return {

    userId:
      input.userId,

    organizationId:
      input.organizationId,

    workspaceId:
      input.workspaceId,

    workflowId:
      input.workflowId,

    intent:
      input.intent,

    lead:
      input.lead,

    metadata:
      input.metadata ?? {},

  };

}