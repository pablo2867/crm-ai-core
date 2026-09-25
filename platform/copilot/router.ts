import {
  runtimeEngine,
} from "@/platform/runtime";

import {
  resolveIntent,
  CopilotIntent,
} from "./intent-resolver";

export async function routeCopilotRequest(
  message: string,
  input: Record<string, unknown> = {}
) {
  const intent: CopilotIntent | null =
    resolveIntent(message);

  // AUTHORITY TRACE:
  // Verifica qué intent sale realmente del Copilot Router.
  console.log(
    "[AUTHORITY TRACE] ROUTER",
    JSON.stringify({
      message,
      resolvedIntent: intent?.intent ?? null,
      confidence: intent?.confidence ?? null,
    })
  );

  if (!intent) {
    return {
      handled: false,
    };
  }

  const result =
    await runtimeEngine.execute({
      message,

      intent: intent.intent,

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

      context: input,
    });

  return {
    handled: true,
    result,
  };
}
