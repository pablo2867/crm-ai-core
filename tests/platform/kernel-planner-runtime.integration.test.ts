import { describe, expect, it, vi } from "vitest";

const {
  decisionWorkflow,
  decisionMock,
  validationMock,
  plannerMock,
  plannerExecutorMock,
} = vi.hoisted(() => {
  const workflow = {
    id: "sales-followup",
    name: "Sales Followup",
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
      tags: ["sales"],
    },
  };

  const workflowResult = {
    workflowId: workflow.id,
    workflowName: workflow.name,
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
  };

  return {
    decisionWorkflow: workflow,

    decisionMock: {
      decide: vi.fn().mockResolvedValue({
        workflow,
        workflowId: workflow.id,
        capabilityId: undefined,
        confidence: 0.95,
        status: "approved",
        requiresReview: false,
        margin: 0.4,
        reason: "Workflow seleccionado por test.",
        explanation: {
          summary: "sales.followup",
        },
        selectedScore: 95,
        nextBestAction: "execute",
        ranking: [],
        decisionContext: {},
      }),
    },

    validationMock: {
      validate: vi.fn().mockResolvedValue({
        valid: true,
        results: [],
      }),
    },

    plannerMock: {
      createPlan: vi.fn().mockReturnValue({
        goal: "Dar seguimiento al mejor lead",
        execution: [
          {
            workflowId: workflow.id,
            priority: 90,
            capabilityId: undefined,
          },
        ],
      }),
    },

    plannerExecutorMock: {
      execute: vi.fn().mockResolvedValue({
        success: true,
        executedSteps: 1,
        completed: [workflow.id],
        results: [workflowResult],
        plan: {
          goal: "Dar seguimiento al mejor lead",
          execution: [
            {
              workflowId: workflow.id,
              priority: 90,
            },
          ],
        },
      }),
    },
  };
});

vi.mock("@/platform/decision", () => ({
  decisionEngine: decisionMock,
}));

vi.mock("@/platform/validation", () => ({
  validationEngine: validationMock,
  buildValidationContext: vi.fn((input) => input),
}));

vi.mock("@/platform/planner", () => ({
  planner: plannerMock,
  plannerExecutor: plannerExecutorMock,
}));

vi.mock("@/lib/supabase-admin", () => ({
  supabaseAdmin: {},
}));

vi.mock("@/platform/context", () => ({
  contextEngine: {
    build: vi.fn().mockResolvedValue(null),
  },
}));

vi.mock("@/platform/memory", () => ({
  memoryEngine: {
    recall: vi.fn().mockResolvedValue([]),
    remember: vi.fn().mockResolvedValue(undefined),
  },
}));

vi.mock("@/platform/leads/repository", () => ({
  getLead: vi.fn().mockResolvedValue(undefined),
}));

import { aiKernel } from "@/platform/kernel";

describe("Kernel → Planner → Runtime integration", () => {
  it("ejecuta la cadena completa conservando la autoridad de Decision", async () => {
    const result = await aiKernel.execute({
      message: "Dar seguimiento al mejor lead",
      intent: "sales.followup",
      userId: "user-test-001",
      organizationId: "org-test-001",
      workspaceId: "workspace-test-001",
      moduleId: "sales",
      context: {
        source: "integration-test",
      },
    });

    expect(decisionMock.decide).toHaveBeenCalledTimes(1);

    expect(validationMock.validate).toHaveBeenCalledTimes(1);

    expect(plannerMock.createPlan).toHaveBeenCalledTimes(1);

    expect(plannerMock.createPlan).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Dar seguimiento al mejor lead",
        intent: "sales.followup",
        userId: "user-test-001",
        organizationId: "org-test-001",
        workspaceId: "workspace-test-001",
        moduleId: "sales",
        workflow: decisionWorkflow,
      }),
    );

    expect(plannerExecutorMock.execute).toHaveBeenCalledTimes(1);

    const executorCall =
      plannerExecutorMock.execute.mock.calls[0];

    expect(executorCall[0].plan.execution[0].workflowId)
      .toBe(decisionWorkflow.id);

    expect(executorCall[0].context).toEqual(
      expect.objectContaining({
        userId: "user-test-001",
        organizationId: "org-test-001",
        workspaceId: "workspace-test-001",
        intent: "sales.followup",
      }),
    );

    expect(result.handled).toBe(true);

    expect(result.decision.workflow.id)
      .toBe(decisionWorkflow.id);

    expect(result.plan?.execution[0]?.workflowId)
      .toBe(decisionWorkflow.id);

    expect(result.workflow?.workflowId)
      .toBe(decisionWorkflow.id);

    expect(result.workflow?.execution.length)
      .toBe(2);

    expect(result.workflow?.success)
      .toBe(true);

    expect(result.summary.success)
      .toBe(true);

    expect(result.summary.provider)
      .toBe("kernel");

    expect(result.summary.model)
      .toBe("deterministic");
  });
});


