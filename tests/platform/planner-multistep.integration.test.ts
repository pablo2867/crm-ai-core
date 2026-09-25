import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  capabilityExecute: vi.fn(),
  skillExecute: vi.fn(),
  activityAdd: vi.fn(),
  billingGet: vi.fn(),
  enforcementCheck: vi.fn(),
}));

vi.mock("@/platform/capabilities", () => ({
  capabilityEngine: {
    execute: mocks.capabilityExecute,
  },
}));

vi.mock("@/platform/skills", () => ({
  skillEngine: {
    executeSkill: mocks.skillExecute,
  },
}));

vi.mock("@/platform/activity", () => ({
  activityService: {
    add: mocks.activityAdd,
  },
}));

vi.mock("@/platform/billing", () => ({
  billingEngine: {
    get: mocks.billingGet,
    getEntitlements: vi.fn(() => ({
      advanced_workflows: true,
    })),
  },
}));

vi.mock("@/platform/billing/enforcement", () => ({
  planEnforcementEngine: {
    check: mocks.enforcementCheck,
  },
}));

import { PlannerExecutor } from "@/platform/planner/executor";
import type { ExecutionPlan } from "@/platform/planner/types";

describe("Planner Multi-step Runtime Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.skillExecute.mockResolvedValue({
      success: true,
      message: "Skill executed",
      data: { ok: true },
    });

    mocks.capabilityExecute.mockResolvedValue({
      success: true,
      message: "Capability executed",
      data: { ok: true },
    });

    mocks.activityAdd.mockResolvedValue(undefined);

    mocks.billingGet.mockResolvedValue({
      plan: "pro",
    });

    mocks.enforcementCheck.mockReturnValue({
      allowed: true,
      reason: null,
    });
  });

  it("ejecuta múltiples workflows del Planner en orden", async () => {
    const executor = new PlannerExecutor();

    const plan: ExecutionPlan = {
      execution: [
        {
          workflowId: "general-chat",
          capabilityId: undefined,
          priority: 1,
        },
        {
          workflowId: "sales-followup",
          capabilityId: undefined,
          priority: 2,
        },
      ],
    };

    const context = {
      userId: "user-multistep-test",
      organizationId: "org-multistep-test",
      workspaceId: "workspace-multistep-test",
      intent: "sales.followup",
      message: "Ejecutar flujo múltiple",
    };

    const result = await executor.execute({
      plan,
      context,
    });

    expect(result.success).toBe(true);
    expect(result.executedSteps).toBe(2);

    expect(result.completed).toEqual([
      "general-chat",
      "sales-followup",
    ]);

    expect(result.failedStep).toBeUndefined();
    expect(result.results).toHaveLength(2);

    const firstResult = result.results[0] as {
      workflowId?: string;
      success?: boolean;
    };

    const secondResult = result.results[1] as {
      workflowId?: string;
      success?: boolean;
    };

    expect(firstResult.workflowId).toBe(
      "general-chat",
    );

    expect(firstResult.success).toBe(true);

    expect(secondResult.workflowId).toBe(
      "sales-followup",
    );

    expect(secondResult.success).toBe(true);
  });

  it("detiene la ejecución cuando un workflow falla", async () => {
    const executor = new PlannerExecutor();

    mocks.skillExecute
      .mockResolvedValueOnce({
        success: true,
        message: "First workflow success",
        data: { step: 1 },
      })
      .mockResolvedValueOnce({
        success: false,
        message: "Second workflow failed",
        data: { step: 2 },
      });

    const plan: ExecutionPlan = {
      execution: [
        {
          workflowId: "general-chat",
          capabilityId: undefined,
          priority: 1,
        },
        {
          workflowId: "sales-followup",
          capabilityId: undefined,
          priority: 2,
        },
      ],
    };

    const context = {
      userId: "user-failure-test",
      organizationId: "org-failure-test",
      workspaceId: "workspace-failure-test",
      intent: "sales.followup",
      message: "Probar detención ante fallo",
    };

    const result = await executor.execute({
      plan,
      context,
    });

    expect(result.success).toBe(false);

    expect(result.executedSteps).toBe(1);

    expect(result.completed).toEqual([
      "general-chat",
    ]);

    expect(result.failedStep).toBe(
      "sales-followup",
    );

    expect(result.results).toHaveLength(2);

    expect(mocks.skillExecute).toHaveBeenCalledTimes(2);
  });
});
