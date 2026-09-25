import { describe, expect, it, vi } from "vitest";

const { mockFrom } = vi.hoisted(() => ({
  mockFrom: vi.fn(),
}));

vi.mock("@/lib/supabase-admin", () => ({
  supabaseAdmin: {
    from: mockFrom,
  },
}));

import { tenantIsolationRule } from "@/platform/diagnostics/rules/tenant/isolation";

function mockLeads(data: unknown[], error: unknown = null) {
  const query = {
    eq: vi.fn(),
  };

  query.eq.mockImplementation(() => query);

  query.then = vi.fn((resolve: (value: unknown) => unknown) =>
    Promise.resolve(resolve({ data, error })),
  ) as typeof query.then;

  mockFrom.mockReturnValue({
    select: vi.fn().mockReturnValue(query),
  });
}

describe("Tenant Isolation Rule", () => {
  it("permite un tenant cuando todos sus leads pertenecen al organization/workspace activo", async () => {
    mockLeads([
      {
        id: 1,
        user_id: "user-1",
        organization_id: "org-1",
        workspace_id: "workspace-1",
      },
      {
        id: 2,
        user_id: "user-1",
        organization_id: "org-1",
        workspace_id: "workspace-1",
      },
    ]);

    const result = await tenantIsolationRule.check({
      request: {
        tenant: {
          userId: "user-1",
          organizationId: "org-1",
          workspaceId: "workspace-1",
        },
      },
    } as never);

    expect(result).toBeNull();
    expect(mockFrom).toHaveBeenCalledWith("leads");
  });

  it("detecta un lead perteneciente a otro tenant", async () => {
    mockLeads([
      {
        id: 1,
        user_id: "user-1",
        organization_id: "org-1",
        workspace_id: "workspace-1",
      },
      {
        id: 2,
        user_id: "user-1",
        organization_id: "org-2",
        workspace_id: "workspace-2",
      },
    ]);

    const result = await tenantIsolationRule.check({
      request: {
        tenant: {
          userId: "user-1",
          organizationId: "org-1",
          workspaceId: "workspace-1",
        },
      },
    } as never);

    expect(result).not.toBeNull();
    expect(result?.id).toBe("tenant.isolation.leads-mismatch");
    expect(result?.severity).toBe("critical");
    expect(result?.risk).toBe("critical");
    expect(result?.evidence).toHaveLength(1);
  });

  it("rechaza un contexto tenant incompleto", async () => {
    const result = await tenantIsolationRule.check({
      request: {
        tenant: {
          userId: "user-1",
          organizationId: undefined,
          workspaceId: "workspace-1",
        },
      },
    } as never);

    expect(result).not.toBeNull();
    expect(result?.id).toBe("tenant.isolation.missing-context");
    expect(result?.severity).toBe("high");
    expect(result?.risk).toBe("high");
  });
});
