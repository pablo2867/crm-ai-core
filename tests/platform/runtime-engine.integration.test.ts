import { describe, expect, it, vi } from "vitest";

const {
  decisionMock,
  validationMock,
  plannerMock,
  plannerExecutorMock,
  contextMock,
  memoryMock,
  getLeadMock,
} = vi.hoisted(() => ({
  decisionMock: {
    decide: vi.fn().mockResolvedValue({
      status: "selected",
      workflow: {
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
      },
      workflowId: "sales-followup",
      confidence: 0.95,
      requiresReview: false,
      margin: 0.4,
      reason: "Workflow seleccionado por Decision Engine",
      explanation: {
        summary: "Sales followup seleccionado",
        factors: [],
      },
      selectedScore: 95,
      nextBestAction: "Ejecutar seguimiento",
      ranking: [],
      decisionContext: {},
    }),
  },

  validationMock: {
    validate: vi.fn().mockResolvedValue({
      valid: true,
      success: true,
      errors: [],
      warnings: [],
      checks: [],
    }),
  },

  plannerMock: {
    createPlan: vi.fn().mockReturnValue({
      goal: "Dar seguimiento al mejor lead",

      steps: [
        {
          id: "find-best-lead",
          workflowId: "sales-followup",
          skill: "find-best-lead",
          order: 1,
        },
        {
          id: "generate-followup",
          workflowId: "sales-followup",
          skill: "generate-followup",
          order: 2,
        },
      ],

      execution: [
        {
          workflowId: "sales-followup",
          capabilityId: undefined,
          priority: 90,
        },
      ],

      metadata: {
        createdAt: new Date().toISOString(),
        source: "planner",
        version: 1,
      },
    }),
  },

  plannerExecutorMock: {
    execute: vi.fn().mockResolvedValue({
      success: true,
      executedSteps: 1,
      completed: ["sales-followup"],
      results: [
        {
          workflowId: "sales-followup",
          workflowName: "Sales Followup",
          success: true,
          context: {},
          results: [],
          execution: [
            {
              skill: "find-best-lead",
              success: true,
              message: "Lead encontrado",
              durationMs: 1,
            },
            {
              skill: "generate-followup",
              success: true,
              message: "Follow-up generado",
              durationMs: 1,
            },
          ],
          totalDurationMs: 2,
        },
      ],
      plan: {
        goal: "Dar seguimiento al mejor lead",
        steps: [
          {
            id: "find-best-lead",
            workflowId: "sales-followup",
            skill: "find-best-lead",
            order: 1,
          },
          {
            id: "generate-followup",
            workflowId: "sales-followup",
            skill: "generate-followup",
            order: 2,
          },
        ],
        execution: [
          {
            workflowId: "sales-followup",
            capabilityId: undefined,
            priority: 90,
          },
        ],
        metadata: {
          createdAt: new Date().toISOString(),
          source: "planner",
          version: 1,
        },
      },
    }),
  },

  contextMock: {
    build: vi.fn().mockResolvedValue({
      user: {
        id: "user-test-001",
      },
      organization: {
        id: "org-test-001",
      },
      workspace: {
        id: "workspace-test-001",
      },
    }),
  },

  memoryMock: {
    recall: vi.fn().mockResolvedValue([]),
    remember: vi.fn().mockResolvedValue(undefined),
  },

  getLeadMock: vi.fn().mockResolvedValue(null),
}));

vi.mock("@/platform/decision", () => ({
  decisionEngine: decisionMock,
}));

vi.mock("@/platform/validation", () => ({
  validationEngine: validationMock,
}));

vi.mock("@/platform/planner", () => ({
  planner: plannerMock,
  plannerExecutor: plannerExecutorMock,
}));

vi.mock("@/platform/context", () => ({
  contextEngine: contextMock,
}));

vi.mock("@/platform/memory", () => ({
  memoryEngine: memoryMock,
}));

vi.mock("@/platform/leads/repository", () => ({
  getLead: getLeadMock,
}));

vi.mock("@/lib/supabase-admin", () => ({
  supabaseAdmin: {},
}));

describe("BLOQUE KERNEL → RUNTIME COMPLETO", async () => {
  const { runtimeEngine } = await import("@/platform/runtime/engine");

  it("ejecuta Runtime → Kernel → Decision → Validation → Planner → Executor → Response", async () => {
    const result = await runtimeEngine.execute({
      message: "Dar seguimiento al mejor lead",
      intent: "sales.followup",
      userId: "user-test-001",
      organizationId: "org-test-001",
      workspaceId: "workspace-test-001",
      moduleId: "sales",
      context: {
        source: "runtime-block-test",
      },
    });

    expect(result.success).toBe(true);

    expect(result.output).toBeDefined();
    expect(result.output?.handled).toBe(true);

    expect(result.decision).toBeDefined();
    expect(result.decision?.workflowId).toBe("sales-followup");

    expect(result.plan).toBeDefined();
    expect(result.plan?.goal).toBe("Dar seguimiento al mejor lead");
    expect(result.plan?.steps).toHaveLength(2);
    expect(result.plan?.execution).toBeDefined();
    expect(result.plan?.execution).toHaveLength(1);
    expect(result.plan?.execution[0]?.workflowId).toBe("sales-followup");

    expect(result.plan?.metadata.source).toBe("planner");
    expect(result.plan?.metadata.version).toBe(1);

    expect(result.workflow).toBeDefined();
    expect(result.workflow?.workflowId).toBe("sales-followup");
    expect(result.workflow?.success).toBe(true);

    expect(result.validation).toBeDefined();
    expect(result.validation?.success).toBe(true);

    expect(result.summary).toBeTruthy();

    expect(result.steps).toHaveLength(4);
    expect(result.steps.every((step) => step.status === "completed")).toBe(true);

    expect(decisionMock.decide).toHaveBeenCalledTimes(1);
    expect(validationMock.validate).toHaveBeenCalledTimes(1);
    expect(plannerMock.createPlan).toHaveBeenCalledTimes(1);
    expect(plannerExecutorMock.execute).toHaveBeenCalledTimes(1);

    expect(memoryMock.recall).toHaveBeenCalled();
    expect(memoryMock.remember).toHaveBeenCalled();

    expect(contextMock.build).toHaveBeenCalled();
  });
});




