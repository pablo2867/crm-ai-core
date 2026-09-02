import {
  supabaseAdmin,
} from "@/lib/supabase-admin";

import type {
  TelemetryRecord,
} from "../types";

export class TelemetryRepository {

  /*
  ---------------------------------------
  Save Telemetry
  ---------------------------------------
  */

  async save(
    userId: string,
    organizationId: string,
    workspaceId: string,
    record: TelemetryRecord
  ): Promise<void> {

    const {
      error,
    } =
      await supabaseAdmin
        .from("ai_telemetry")
        .insert({

          user_id:
            userId,

          
          organization_id:
            organizationId,

          workspace_id:
            workspaceId,

          agent_id:
            record.agentId,

          workflow:
            record.workflow ?? null,

          intent:
            record.intent ?? null,

          started_at:
            record.startedAt,

          finished_at:
            record.finishedAt,

          duration:
            record.duration,

          success:
            record.success,

          tokens:
            record.tokens ?? 0,

          memory_reads:
            record.memoryReads ?? 0,

          memory_writes:
            record.memoryWrites ?? 0,

        });

    if (error) {

      console.error(

        "Telemetry Repository:",

        error.message

      );

    }

  }

  /*
  ---------------------------------------
  Find All User Telemetry
  ---------------------------------------
  */

  async findByUser(
    userId: string
  ) {

    const {

      data,

      error,

    } =
      await supabaseAdmin
        .from("ai_telemetry")
        .select("*")
        .eq(
          "user_id",
          userId
        )
        .order(
          "started_at",
          {
            ascending: false,
          }
        );

    if (error) {

      throw error;

    }

    return data ?? [];

  }

  /*
  ---------------------------------------
  Find Recent Executions
  ---------------------------------------
  */

  async findRecent(
    userId: string,
    limit = 20
  ) {

    const {

      data,

      error,

    } =
      await supabaseAdmin
        .from("ai_telemetry")
        .select("*")
        .eq(
          "user_id",
          userId
        )
        .order(
          "started_at",
          {
            ascending: false,
          }
        )
        .limit(limit);

    if (error) {

      throw error;

    }

    return data ?? [];

  }

  /*
  ---------------------------------------
  Summary
  ---------------------------------------
  */

  async summary(
    userId: string
  ) {

    const records =
      await this.findByUser(
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

    return {

      totalExecutions:
        total,

      successfulExecutions:
        successful,

      failedExecutions:
        failed,

      successRate:

        total === 0

          ? 0

          : (
              successful /
              total
            ) * 100,

      averageDuration,

    };

  }

  /*
  ---------------------------------------
  Top Agents
  ---------------------------------------
  */

  async findTopAgents(
    userId: string
  ) {

    const records =
      await this.findByUser(
        userId
      );

    const counter =
      new Map<
        string,
        number
      >();

    for (const record of records) {

      const agent =
        record.agent_id;

      if (!agent) {

        continue;

      }

      counter.set(

        agent,

        (counter.get(agent) ?? 0) + 1

      );

    }

    return [...counter.entries()]

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

  }

  /*
  ---------------------------------------
  Timeline
  ---------------------------------------
  */

  async findTimeline(
    userId: string
  ) {

    const records =
      await this.findByUser(
        userId
      );

    const timeline =
      new Map<
        string,
        number
      >();

    for (const record of records) {

      const date =
        new Date(
          record.started_at
        )
          .toISOString()
          .split("T")[0];

      timeline.set(

        date,

        (timeline.get(date) ?? 0) + 1

      );

    }

    return [...timeline.entries()]

      .map(

        ([date, executions]) => ({

          date,

          executions,

        })

      )

      .sort(

        (a, b) =>

          a.date.localeCompare(
            b.date
          )

      );

  }

}

export const telemetryRepository =
  new TelemetryRepository();
