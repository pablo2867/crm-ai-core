import { describe, expect, it, vi } from "vitest";

import { WorkflowExecutor } from "@/platform/workflows/executor";
import { workflowRegistry } from "@/platform/workflows/registry";

describe("Runtime Integration", () => {
  it("resuelve y ejecuta un workflow basado en skill", async () => {
    const workflow = workflowRegistry.get("general-chat");

    expect(workflow).toBeDefined();
    expect(workflow?.steps[0]?.skill).toBe("chat-response");

    expect(workflow?.metadata?.enabled).toBe(true);
  });

  it("resuelve un workflow basado en capability", async () => {
    const workflow = workflowRegistry.get("whatsapp-proposal");

    expect(workflow).toBeDefined();
    expect(workflow?.steps[0]?.capability).toBe(
      "commercial-proposal",
    );

    expect(workflow?.metadata?.capabilityId).toBe(
      "commercial-proposal",
    );
  });

  it("identifica correctamente un workflow advanced", () => {
    const workflow = workflowRegistry.get("command-center");

    expect(workflow).toBeDefined();
    expect(workflow?.metadata?.advanced).toBe(true);
    expect(workflow?.steps[0]?.capability).toBe(
      "command-center",
    );
  });

  it("mantiene workflows con múltiples skills", () => {
    const workflow = workflowRegistry.get("sales-followup");

    expect(workflow).toBeDefined();
    expect(workflow?.steps.length).toBe(2);

    expect(workflow?.steps[0]?.skill).toBe(
      "find-best-lead",
    );

    expect(workflow?.steps[1]?.skill).toBe(
      "generate-followup",
    );
  });

  it("mantiene Financial como workflow independiente", () => {
    const workflow = workflowRegistry.get("financial-analysis");

    expect(workflow).toBeDefined();
    expect(workflow?.metadata?.category).toBe("financial");
    expect(workflow?.steps[0]?.capability).toBe(
      "financial.analysis",
    );

    expect(workflow?.metadata?.supportedIntents).toContain(
      "financial.analysis",
    );
  });
});
