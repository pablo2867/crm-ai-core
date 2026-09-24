import { beforeEach, describe, expect, it, vi } from "vitest";

import type { TelemetryRecord } from "@/platform/telemetry";

const { saveMock } = vi.hoisted(() => ({
  saveMock: vi.fn(),
}));

vi.mock("@/platform/telemetry/repository/supabase", () => ({
  telemetryRepository: {
    save: saveMock,
  },
}));

import { analyticsEngine } from "@/platform/analytics";
import { telemetryEngine } from "@/platform/telemetry";

describe("Analytics + Telemetry integration", () => {
  beforeEach(() => {
    telemetryEngine.clear();
    vi.clearAllMocks();
  });

  it("integra registros de TelemetryEngine con AnalyticsEngine", async () => {
    const records: TelemetryRecord[] = [
      {
        agentId: "sales-agent",
        workflow: "sales-best-lead",
        intent: "sales",
        startedAt: new Date("2026-09-23T10:00:00.000Z"),
        finishedAt: new Date("2026-09-23T10:00:00.100Z"),
        duration: 100,
        success: true,
      },
      {
        agentId: "sales-agent",
        workflow: "sales-best-lead",
        intent: "sales",
        startedAt: new Date("2026-09-23T10:01:00.000Z"),
        finishedAt: new Date("2026-09-23T10:01:00.250Z"),
        duration: 250,
        success: true,
      },
      {
        agentId: "support-agent",
        workflow: "support",
        intent: "support",
        startedAt: new Date("2026-09-23T10:02:00.000Z"),
        finishedAt: new Date("2026-09-23T10:02:00.400Z"),
        duration: 400,
        success: false,
      },
    ];

    for (const record of records) {
      await telemetryEngine.add(
        "test-user",
        record,
        "test-organization",
        "test-workspace"
      );
    }

    const result = analyticsEngine.analyze();

    expect(saveMock).toHaveBeenCalledTimes(3);

    expect(result.summary.totalExecutions).toBe(3);
    expect(result.summary.successfulExecutions).toBe(2);
    expect(result.summary.failedExecutions).toBe(1);
    expect(result.summary.successRate).toBeCloseTo(66.6666666667);
    expect(result.summary.averageDuration).toBeCloseTo(250);
    expect(result.summary.mostUsedAgent).toBe("sales-agent");
    expect(result.summary.mostUsedIntent).toBe("sales");
    expect(result.summary.slowestAgent).toBe("support-agent");
  });
});
