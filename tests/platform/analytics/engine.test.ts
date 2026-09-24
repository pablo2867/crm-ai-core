import { beforeEach, describe, expect, it, vi } from "vitest";

import type { TelemetryRecord } from "@/platform/telemetry";

const { telemetryAllMock } = vi.hoisted(() => ({
  telemetryAllMock: vi.fn(),
}));

vi.mock("@/platform/telemetry", () => ({
  telemetryEngine: {
    all: telemetryAllMock,
  },
}));

import { analyticsEngine } from "@/platform/analytics";

describe("AnalyticsEngine", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calcula correctamente las métricas de ejecución", () => {
    const records: TelemetryRecord[] = [
      {
        agentId: "agent-a",
        workflow: "sales",
        intent: "sales",
        startedAt: new Date("2026-09-23T10:00:00.000Z"),
        finishedAt: new Date("2026-09-23T10:00:00.100Z"),
        duration: 100,
        success: true,
        tokens: 100,
        memoryReads: 2,
        memoryWrites: 1,
      },
      {
        agentId: "agent-a",
        workflow: "sales",
        intent: "sales",
        startedAt: new Date("2026-09-23T10:01:00.000Z"),
        finishedAt: new Date("2026-09-23T10:01:00.200Z"),
        duration: 200,
        success: true,
        tokens: 120,
        memoryReads: 3,
        memoryWrites: 1,
      },
      {
        agentId: "agent-c",
        workflow: "support",
        intent: "support",
        startedAt: new Date("2026-09-23T10:02:00.000Z"),
        finishedAt: new Date("2026-09-23T10:02:00.300Z"),
        duration: 300,
        success: false,
        tokens: 150,
        memoryReads: 4,
        memoryWrites: 2,
      },
    ];

    telemetryAllMock.mockReturnValue(records);

    const result = analyticsEngine.analyze();

    expect(result.summary.totalExecutions).toBe(3);
    expect(result.summary.successfulExecutions).toBe(2);
    expect(result.summary.failedExecutions).toBe(1);
    expect(result.summary.successRate).toBeCloseTo(66.6666666667);
    expect(result.summary.averageDuration).toBe(200);
    expect(result.summary.mostUsedAgent).toBe("agent-a");
    expect(result.summary.mostUsedIntent).toBe("sales");
    expect(result.summary.slowestAgent).toBe("agent-c");
  });
});
