import {
  routeCopilotRequest,
} from "./router";

import {
  runtimeEngine,
} from "@/platform/runtime";

import type {
  CopilotHandledResponse,
} from "./types";

interface WorkflowChatResult {
  data?: {
    answer?: unknown;
  };
}

function extractWorkflowAnswer(
  results: unknown
): string | undefined {

  if (!Array.isArray(results)) {
    return undefined;
  }

  for (const item of results) {

    if (
      typeof item !== "object" ||
      item === null
    ) {
      continue;
    }

    const result =
      item as WorkflowChatResult;

    const answer =
      result.data?.answer;

    if (
      typeof answer === "string" &&
      answer.trim()
    ) {
      return answer.trim();
    }

  }

  return undefined;
}

export class CopilotController {

  async handle(
    question: string,
    input: Record<string, unknown> = {}
  ): Promise<CopilotHandledResponse> {

    /*
    ---------------------------------------
    1. Resolver mediante Skills / Runtime
    ---------------------------------------
    */

    const routed =
      await routeCopilotRequest(
        question,
        input
      );

    if (
      routed.handled &&
      routed.result
    ) {

      const runtime =
        routed.result;

      const workflowAnswer =
        extractWorkflowAnswer(
          runtime.workflow?.results
        );

      return {

        handled: true,

        result: {

          success:
            runtime.success,

          answer:
            workflowAnswer ??
            runtime.summary,

          runtime,

          decision:
            runtime.decision,

          workflow:
            runtime.workflow,

          plan:
            runtime.plan,

          validation:
            runtime.validation,

          explanation:
            runtime.explanation,

        },

      };

    }

    /*
    ---------------------------------------
    2. Delegar al Runtime como Copilot
    ---------------------------------------
    */

    const runtime =
      await runtimeEngine.execute({

        message:
          question,

        intent:
          "copilot",

        userId:
          typeof input.userId === "string"
            ? input.userId
            : undefined,

        leadId:
          typeof input.leadId === "number"
            ? input.leadId
            : undefined,

        organizationId:
          typeof input.organizationId === "string"
            ? input.organizationId
            : undefined,

        workspaceId:
          typeof input.workspaceId === "string"
            ? input.workspaceId
            : undefined,

        moduleId:
          typeof input.moduleId === "string"
            ? input.moduleId
            : undefined,

        context:
          input,

      });

    if (runtime.success) {

      const workflowAnswer =
        extractWorkflowAnswer(
          runtime.workflow?.results
        );

      return {

        handled: true,

        result: {

          success:
            true,

          answer:
            workflowAnswer ??
            runtime.summary,

          runtime,

          decision:
            runtime.decision,

          workflow:
            runtime.workflow,

          plan:
            runtime.plan,

          validation:
            runtime.validation,

          explanation:
            runtime.explanation,

        },

      };

    }

    /*
    ---------------------------------------
    3. Flujo clásico
    ---------------------------------------
    */

    return {

      handled: false,

    };

  }

}

export const copilotController =
  new CopilotController();
