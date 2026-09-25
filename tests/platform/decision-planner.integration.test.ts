import { describe, expect, it, vi } from "vitest";

const { decisionMock, decisionWorkflow } = vi.hoisted(() => {
  const workflow = {
    id: "sales-followup",
    name: "Sales Follow-up",
    steps: [
      {
        id: "find-best-lead",
        skill: "find-best-lead",
      },
      {
        id: "generate-followup",
        skill: "generate-followup",
      },
    ],
    metadata: {
      enabled: true,
      priority: 90,
      category: "sales",
      supportedIntents: ["sales.followup"],
      tags: ["sales", "followup"],
    },
  };

  return {
    decisionWorkflow: workflow,
    decisionMock: {
      decide: vi.fn().mockResolvedValue({
        workflow,
        workflowId: "sales-followup",
        confidence: 96,
        status: "approved",
        requiresReview: false,
        margin: 20,
        reason: "Workflow seleccionado por Decision Engine.",
        explanation: {},
        selectedScore: 96,
        nextBestAction: {},
        ranking: [],
        decisionContext: {},
      }),
    },
  };
});

vi.mock("@/platform/decision", () => ({
  decisionEngine: decisionMock,
}));

vi.mock("@/lib/supabase-admin", () => ({
  supabaseAdmin: {},
}));

import { SalesPlanner } from "@/platform/agents/sales/planner";

describe("Decision → Planner integration", () => {
  it("entrega al Planner exactamente el workflow seleccionado por Decision Engine", async () => {
    const salesPlanner = new SalesPlanner();

    const result = await salesPlanner.createPlan(
      "Dar seguimiento al mejor lead",
      {
        intent: "sales.followup",
        confidence: 0.96,
      } as never,
      "user-test-001",
      {
        organizationId: "org-test-001",
        workspaceId: "workspace-test-001",
      },
    );

    expect(decisionMock.decide).toHaveBeenCalledTimes(1);

    expect(result.workflow).toBe(decisionWorkflow);

    expect(result.workflow.id).toBe("sales-followup");

    expect(result.executionPlan.execution).toHaveLength(1);

    expect(
      result.executionPlan.execution[0].workflowId,
    ).toBe("sales-followup");

    expect(result.executionPlan.steps).toHaveLength(2);

    expect(result.executionPlan.steps[0].title).toBe(
      "find-best-lead",
    );

    expect(result.executionPlan.steps[1].title).toBe(
      "generate-followup",
    );
  });
});
