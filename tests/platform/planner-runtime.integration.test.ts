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

import {
  PlannerExecutor,
} from "@/platform/planner/executor";

import type {
  ExecutionPlan,
} from "@/platform/planner/types";

describe("Planner → Workflow Runtime Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.skillExecute.mockResolvedValue({
      success: true,
      message: "Skill executed",
      data: {
        source: "planner-runtime-test",
      },
    });

    mocks.capabilityExecute.mockResolvedValue({
      success: true,
      message: "Capability executed",
      data: {
        source: "planner-runtime-test",
      },
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

  it("ejecuta el workflow resuelto por el Planner hasta el Runtime", async () => {
    const executor = new PlannerExecutor();

    const plan: ExecutionPlan = {
      execution: [
        {
          workflowId: "general-chat",
          capabilityId: undefined,
          priority: 1,
        },
      ],
    };

    const context = {
      userId: "user-planner-test",
      organizationId: "org-planner-test",
      workspaceId: "workspace-planner-test",
      intent: "general.chat",
      message: "Mensaje desde Planner",
    };

    const result = await executor.execute({
      plan,
      context,
    });

    expect(result.success).toBe(true);
    expect(result.executedSteps).toBe(1);
    expect(result.completed).toEqual([
      "general-chat",
    ]);

    expect(result.failedStep).toBeUndefined();
    expect(result.results).toHaveLength(1);

    expect(
      mocks.skillExecute,
    ).toHaveBeenCalled();

    const skillInput =
      mocks.skillExecute.mock.calls[0]?.[1];

    expect(skillInput).toMatchObject({
      userId: "user-planner-test",
      organizationId: "org-planner-test",
      workspaceId: "workspace-planner-test",
    });
  });

  it("mantiene el workflowId del Planner hasta el resultado final", async () => {
    const executor = new PlannerExecutor();

    const plan: ExecutionPlan = {
      execution: [
        {
          workflowId: "sales-followup",
          capabilityId: undefined,
          priority: 10,
        },
      ],
    };

    const context = {
      userId: "user-planner-test",
      organizationId: "org-planner-test",
      workspaceId: "workspace-planner-test",
      intent: "sales.followup",
      message: "Generar seguimiento comercial",
    };

    const result = await executor.execute({
      plan,
      context,
    });

    expect(result.success).toBe(true);
    expect(result.executedSteps).toBe(1);
    expect(result.completed).toEqual([
      "sales-followup",
    ]);

    expect(result.results).toHaveLength(1);

    const workflowResult =
      result.results[0] as {
        workflowId?: string;
        workflowName?: string;
        success?: boolean;
      };

    expect(workflowResult.workflowId).toBe(
      "sales-followup",
    );

    expect(workflowResult.success).toBe(true);
  });

  it("rechaza correctamente un workflow inexistente", async () => {
    const executor = new PlannerExecutor();

    const plan: ExecutionPlan = {
      execution: [
        {
          workflowId: "workflow-that-does-not-exist",
          capabilityId: undefined,
          priority: 1,
        },
      ],
    };

    const context = {
      userId: "user-planner-test",
      organizationId: "org-planner-test",
      workspaceId: "workspace-planner-test",
      intent: "test.invalid",
      message: "Workflow inexistente",
    };

    const result = await executor.execute({
      plan,
      context,
    });

    expect(result.success).toBe(false);
    expect(result.executedSteps).toBe(0);

    expect(result.completed).toEqual([]);

    expect(result.failedStep).toBe(
      "workflow-that-does-not-exist",
    );

    expect(result.results).toEqual([]);

    expect(
      mocks.skillExecute,
    ).not.toHaveBeenCalled();

    expect(
      mocks.capabilityExecute,
    ).not.toHaveBeenCalled();
  });
});
