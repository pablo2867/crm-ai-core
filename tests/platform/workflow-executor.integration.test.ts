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

import { WorkflowExecutor } from "@/platform/workflows/executor";
import type {
  Workflow,
  WorkflowContext,
} from "@/platform/workflows/types";

describe("WorkflowExecutor Runtime Execution", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.capabilityExecute.mockResolvedValue({
      success: true,
      message: "Capability executed",
      data: { ok: true },
    });

    mocks.skillExecute.mockResolvedValue({
      success: true,
      message: "Skill executed",
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

  it("ejecuta workflow basado en skill y conserva contexto", async () => {
    const executor = new WorkflowExecutor();

    const workflow: Workflow = {
      id: "runtime-test-skill",
      name: "Runtime Test Skill",
      metadata: {
        enabled: true,
        priority: 1,
        category: "test",
        supportedIntents: ["test.skill"],
        tags: ["test"],
      },
      steps: [
        {
          id: "step-1",
          skill: "chat-response",
        },
      ],
    };

    const context: WorkflowContext = {
      userId: "user-test",
      organizationId: "org-test",
      workspaceId: "workspace-test",
      intent: "test.skill",
      message: "Mensaje original de prueba",
    };

    const result = await executor.execute(workflow, context);

    expect(result.success).toBe(true);
    expect(result.workflowId).toBe("runtime-test-skill");
    expect(result.workflowName).toBe("Runtime Test Skill");
    expect(mocks.skillExecute).toHaveBeenCalled();

    const skillInput = mocks.skillExecute.mock.calls[0]?.[1];

    expect(skillInput).toMatchObject({
      userId: "user-test",
      organizationId: "org-test",
      workspaceId: "workspace-test",
    });
  });

  it("ejecuta workflow basado en capability y conserva intent y mensaje", async () => {
    const executor = new WorkflowExecutor();

    const workflow: Workflow = {
      id: "runtime-test-capability",
      name: "Runtime Test Capability",
      metadata: {
        enabled: true,
        priority: 1,
        category: "test",
        supportedIntents: ["test.capability"],
        tags: ["test"],
        capabilityId: "test-capability",
      },
      steps: [
        {
          id: "step-1",
          capability: "test-capability",
        },
      ],
    };

    const context: WorkflowContext = {
      userId: "user-test",
      organizationId: "org-test",
      workspaceId: "workspace-test",
      intent: "test.capability",
      message: "Solicitud original",
    };

    const result = await executor.execute(workflow, context);

    expect(result.success).toBe(true);
    expect(result.workflowId).toBe("runtime-test-capability");
    expect(result.workflowName).toBe("Runtime Test Capability");
    expect(mocks.capabilityExecute).toHaveBeenCalled();

    const capabilityInput =
      mocks.capabilityExecute.mock.calls[0]?.[1];

    expect(capabilityInput).toMatchObject({
      userId: "user-test",
      organizationId: "org-test",
      workspaceId: "workspace-test",
      workflowId: "runtime-test-capability",
      intent: "test.capability",
      goal: "Solicitud original",
    });
  });

  it("aplica enforcement para workflows advanced", async () => {
    const executor = new WorkflowExecutor();

    const workflow: Workflow = {
      id: "runtime-test-advanced",
      name: "Runtime Test Advanced",
      metadata: {
        enabled: true,
        advanced: true,
        priority: 100,
        category: "test",
        supportedIntents: ["test.advanced"],
        tags: ["test"],
      },
      steps: [
        {
          id: "step-1",
          capability: "advanced-test",
        },
      ],
    };

    const context: WorkflowContext = {
      userId: "user-test",
      organizationId: "org-test",
      workspaceId: "workspace-test",
      intent: "test.advanced",
      message: "Advanced request",
    };

    const result = await executor.execute(workflow, context);

    expect(result.success).toBe(true);
    expect(mocks.billingGet).toHaveBeenCalledWith("org-test");

    expect(mocks.enforcementCheck).toHaveBeenCalledWith(
      "advanced_workflows",
      expect.objectContaining({
        organizationId: "org-test",
      }),
    );

    expect(mocks.capabilityExecute).toHaveBeenCalled();
  });

  it("rechaza workflow advanced sin organizationId", async () => {
    const executor = new WorkflowExecutor();

    const workflow: Workflow = {
      id: "runtime-test-advanced-no-org",
      name: "Runtime Test Advanced No Org",
      metadata: {
        enabled: true,
        advanced: true,
        priority: 100,
        category: "test",
        supportedIntents: ["test.advanced"],
        tags: ["test"],
      },
      steps: [
        {
          id: "step-1",
          capability: "advanced-test",
        },
      ],
    };

    const context: WorkflowContext = {
      userId: "user-test",
      intent: "test.advanced",
      message: "Advanced request",
    };

    await expect(
      executor.execute(workflow, context),
    ).rejects.toThrow("ORGANIZATION_ID_REQUIRED");

    expect(mocks.capabilityExecute).not.toHaveBeenCalled();
  });
});
