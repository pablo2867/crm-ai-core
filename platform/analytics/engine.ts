import {
  telemetryEngine,
} from "@/platform/telemetry";

import type {
  TelemetryRecord,
} from "@/platform/telemetry";

import type {
  AnalyticsResult,
} from "./types";

export class AnalyticsEngine {

  analyze(): AnalyticsResult {

    const records =
      telemetryEngine.all();

    const total =
      records.length;

    const successful =
      records.filter(
        (record) => record.success
      ).length;

    const failed =
      total - successful;

    const averageDuration =
      total === 0
        ? 0
        : records.reduce(

            (sum, record) =>

              sum + record.duration,

            0

          ) / total;

    const successRate =
      total === 0
        ? 0
        : (successful / total) * 100;

    const mostUsedAgent =
      this.findMostRepeated(

        records,

        (record) => record.agentId

      );

    const mostUsedIntent =
      this.findMostRepeated(

        records,

        (record) => record.intent ?? ""

      );

    const slowestAgent =
      this.findSlowestAgent(
        records
      );

    return {

      summary: {

        totalExecutions: total,

        successfulExecutions:
          successful,

        failedExecutions:
          failed,

        successRate,

        averageDuration,

        mostUsedAgent,

        mostUsedIntent,

        slowestAgent,

      },

    };

  }

  private findMostRepeated(

    records: TelemetryRecord[],

    selector: (
      record: TelemetryRecord
    ) => string

  ): string | undefined {

    const counter =
      new Map<string, number>();

    for (const record of records) {

      const value =
        selector(record);

      if (!value) {

        continue;

      }

      counter.set(

        value,

        (counter.get(value) ?? 0) + 1

      );

    }

    let winner:
      string | undefined;

    let max = 0;

    counter.forEach(

      (count, value) => {

        if (count > max) {

          max = count;

          winner = value;

        }

      }

    );

    return winner;

  }

  private findSlowestAgent(

    records: TelemetryRecord[]

  ): string | undefined {

    if (
      records.length === 0
    ) {

      return undefined;

    }

    return records.reduce(

      (slowest, current) =>

        current.duration >
        slowest.duration

          ? current

          : slowest

    ).agentId;

  }

}

export const analyticsEngine =
  new AnalyticsEngine();