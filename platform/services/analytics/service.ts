import {
  telemetryRepository,
} from "@/platform/telemetry/repository/supabase";

import type {
  AnalyticsDashboardDTO,
} from "@/platform/analytics/dto";

export class AnalyticsService {

  async getDashboard(
    userId: string
  ): Promise<AnalyticsDashboardDTO> {

    const records =
      await telemetryRepository.getAnalyticsRecords(
        userId
      );

    const total =
      records.length;

    const successful =
      records.filter(
        (record) =>
          record.success
      ).length;

    const failed =
      total -
      successful;

    const averageDuration =
      total === 0
        ? 0
        : records.reduce(
            (
              sum,
              record
            ) =>
              sum +
              (record.duration ?? 0),
            0
          ) / total;

    const agentCounts =
      new Map<string, number>();

    for (const record of records) {

      const agent =
        record.agent_id;

      if (!agent) {
        continue;
      }

      agentCounts.set(
        agent,
        (agentCounts.get(agent) ?? 0) + 1
      );

    }

    const topAgents =
      Array.from(
        agentCounts.entries()
      )
        .map(
          ([agent, executions]) => ({
            agent,
            executions,
          })
        )
        .sort(
          (a, b) =>
            b.executions -
            a.executions
        );

    const timelineMap =
      new Map<string, number>();

    for (const record of records) {

      if (!record.started_at) {
        continue;
      }

      const date =
        new Date(
          record.started_at
        )
          .toISOString()
          .slice(0, 10);

      timelineMap.set(
        date,
        (timelineMap.get(date) ?? 0) + 1
      );

    }

    const timeline =
      Array.from(
        timelineMap.entries()
      )
        .sort(
          ([a], [b]) =>
            a.localeCompare(b)
        )
        .map(
          ([date, executions]) => ({
            date,
            executions,
          })
        );

    const recentExecutions =
      records
        .slice(0, 20)
        .map(
          (record) => ({
            agent_id:
              record.agent_id,
            workflow:
              record.workflow ?? null,
            intent:
              record.intent ?? null,
            duration:
              record.duration,
            success:
              record.success,
            started_at:
              record.started_at,
            finished_at:
              record.finished_at,
            tokens:
              record.tokens ?? null,
            memory_reads:
              record.memory_reads ?? null,
            memory_writes:
              record.memory_writes ?? null,
          })
        );

    return {

      summary: {

        totalExecutions:
          total,

        successfulExecutions:
          successful,

        failedExecutions:
          failed,

        successRate:
          total === 0
            ? 0
            : (successful / total) * 100,

        averageDuration,

        mostUsedAgent:
          topAgents.length > 0
            ? topAgents[0].agent
            : undefined,

      },

      topAgents,

      timeline,

      recentExecutions,

    };

  }

}

export const analyticsService =
  new AnalyticsService();
