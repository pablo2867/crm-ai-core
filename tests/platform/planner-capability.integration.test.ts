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

describe("Planner → Capability Runtime Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.capabilityExecute.mockResolvedValue({
      success: true,
      message: "Capability executed",
      data: {
        source: "planner-capability-test",
      },
    });

    mocks.skillExecute.mockResolvedValue({
      success: true,
      message: "Skill executed",
      data: {
        source: "planner-capability-test",
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

  it("ejecuta un workflow de capability desde el Planner hasta el Runtime", async () => {
    const executor = new PlannerExecutor();

    const plan: ExecutionPlan = {
      execution: [
        {
          workflowId: "whatsapp-proposal",
          capabilityId: "commercial-proposal",
          priority: 1,
        },
      ],
    };

    const context = {
      userId: "user-capability-test",
      organizationId: "org-capability-test",
      workspaceId: "workspace-capability-test",
      intent: "whatsapp.proposal",
      message: "Generar propuesta comercial",
    };

    const result = await executor.execute({
      plan,
      context,
    });

    expect(result.success).toBe(true);
    expect(result.executedSteps).toBe(1);

    expect(result.completed).toEqual([
      "whatsapp-proposal",
    ]);

    expect(result.failedStep).toBeUndefined();
    expect(result.results).toHaveLength(1);

    expect(
      mocks.capabilityExecute,
    ).toHaveBeenCalled();

    const capabilityInput =
      mocks.capabilityExecute.mock.calls[0]?.[1];

    expect(capabilityInput).toMatchObject({
      userId: "user-capability-test",
      organizationId: "org-capability-test",
      workspaceId: "workspace-capability-test",
      workflowId: "whatsapp-proposal",
      intent: "whatsapp.proposal",
      goal: "Generar propuesta comercial",
    });

    expect(
      mocks.skillExecute,
    ).not.toHaveBeenCalled();
  });

  it("conserva el workflow y capability en el resultado final", async () => {
    const executor = new PlannerExecutor();

    const plan: ExecutionPlan = {
      execution: [
        {
          workflowId: "whatsapp-proposal",
          capabilityId: "commercial-proposal",
          priority: 1,
        },
      ],
    };

    const context = {
      userId: "user-capability-test",
      organizationId: "org-capability-test",
      workspaceId: "workspace-capability-test",
      intent: "whatsapp.proposal",
      message: "Crear propuesta para el cliente",
    };

    const result = await executor.execute({
      plan,
      context,
    });

    expect(result.success).toBe(true);

    const workflowResult =
      result.results[0] as {
        workflowId?: string;
        workflowName?: string;
        success?: boolean;
      };

    expect(workflowResult.workflowId).toBe(
      "whatsapp-proposal",
    );

    expect(workflowResult.workflowName).toBe(
      "WhatsApp Commercial Proposal",
    );

    expect(workflowResult.success).toBe(true);
  });
});

