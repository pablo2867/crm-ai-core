import { describe, expect, it, vi } from "vitest";

const { decisionMock, decisionWorkflow, workflowEngineMock } =
  vi.hoisted(() => {
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
          workflowId: workflow.id,
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

      workflowEngineMock: {
        execute: vi.fn().mockResolvedValue({
          workflowId: workflow.id,
          workflowName: "Sales Followup",
          success: true,
          context: {},
          results: [],
          execution: [
            {
              skill: "find-best-lead",
              success: true,
              message: "ok",
              durationMs: 1,
            },
            {
              skill: "generate-followup",
              success: true,
              message: "ok",
              durationMs: 1,
            },
          ],
          totalDurationMs: 2,
        }),
      },
    };
  });

vi.mock("@/platform/decision", () => ({
  decisionEngine: decisionMock,
}));

vi.mock("@/platform/workflows", async () => {
  const actual = await vi.importActual<
    typeof import("@/platform/workflows")
  >("@/platform/workflows");

  return {
    ...actual,
    workflowEngine: workflowEngineMock,
  };
});

vi.mock("@/lib/supabase-admin", () => ({
  supabaseAdmin: {},
}));

import { SalesPlanner } from "@/platform/agents/sales/planner";
import { plannerExecutor } from "@/platform/planner";

describe("Decision → Planner → Runtime integration", () => {
  it("ejecuta el workflow seleccionado por Decision a través del Planner Runtime", async () => {
    const salesPlanner = new SalesPlanner();

    const salesPlan = await salesPlanner.createPlan(
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

    expect(salesPlan.workflow).toBe(decisionWorkflow);

    expect(salesPlan.executionPlan.execution).toHaveLength(1);

    expect(
      salesPlan.executionPlan.execution[0].workflowId,
    ).toBe(decisionWorkflow.id);

    const runtimeResult = await plannerExecutor.execute({
      plan: salesPlan.executionPlan,
      context: {
        userId: "user-test-001",
        organizationId: "org-test-001",
        workspaceId: "workspace-test-001",
        intent: "sales.followup",
        message: "Dar seguimiento al mejor lead",
      },
    });

    expect(runtimeResult.success).toBe(true);

    expect(runtimeResult.executedSteps).toBe(1);

    expect(runtimeResult.completed).toEqual([
      decisionWorkflow.id,
    ]);

    expect(runtimeResult.results).toHaveLength(1);

    expect(workflowEngineMock.execute).toHaveBeenCalledTimes(1);

    const workflowEngineCall =
      workflowEngineMock.execute.mock.calls[0];

    expect(workflowEngineCall[0].id).toBe(
      decisionWorkflow.id,
    );

    expect(workflowEngineCall[0].name).toBe(
      "Sales Followup",
    );

    expect(workflowEngineCall[1]).toEqual(
      expect.objectContaining({
        userId: "user-test-001",
        organizationId: "org-test-001",
        workspaceId: "workspace-test-001",
        intent: "sales.followup",
        message: "Dar seguimiento al mejor lead",
      }),
    );
  });
});
