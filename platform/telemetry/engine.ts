import {
  telemetryRepository,
} from "./repository/supabase";

import type {

  TelemetryRecord,
  TelemetrySummary,

} from "./types";

export class TelemetryEngine {

  private readonly records: TelemetryRecord[] = [];

  async add(
    userId: string,
    record: TelemetryRecord,
    organizationId: string,
    workspaceId: string
  ): Promise<void> {

    // Cache en memoria

    this.records.push(
      record
    );

    // Persistencia en Supabase

    await telemetryRepository.save(
      userId,
      organizationId,
      workspaceId,
      record
    );

  }

  all(): TelemetryRecord[] {

    return [...this.records];

  }

  clear(): void {

    this.records.length = 0;

  }

  summary(): TelemetrySummary {

    const total =
      this.records.length;

    const successful =
      this.records.filter(

        (record) => record.success

      ).length;

    const failed =
      total - successful;

    const averageDuration =
      total === 0

        ? 0

        : this.records.reduce(

            (

              sum,

              record

            ) =>

              sum + record.duration,

            0

          ) / total;

    return {

      totalExecutions:
        total,

      successfulExecutions:
        successful,

      failedExecutions:
        failed,

      averageDuration,

    };

  }

}

export const telemetryEngine =
  new TelemetryEngine();
