import {
  capabilityProvider,
} from "@/platform/capability-provider";

import {
  buildCapabilityContext,
} from "../builder";

import {
  selectCapability,
} from "./selector";

import type {
  CapabilityRequest,
} from "../types";

export async function selectCapabilityForRequest(
  request: CapabilityRequest
) {

  const context =
    buildCapabilityContext({

      userId:
        request.userId,

      organizationId:
        request.organizationId,

      workspaceId:
        request.workspaceId,

      workflowId:
        request.workflowId,

      intent:
        request.intent,

      lead:
        request.lead,

      metadata:
        request.input,

    });

  return selectCapability({

    capabilities:
      capabilityProvider.getAll(),

    context,

  });

}