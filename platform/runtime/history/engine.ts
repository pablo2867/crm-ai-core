import type {

  RuntimeHistoryEntry,
  RuntimeHistoryStats,

} from "./types";

export class RuntimeHistoryEngine {

  private history:
    RuntimeHistoryEntry[] = [];

  add(
    entry: RuntimeHistoryEntry
  ): void {

    this.history.unshift(entry);

    /*
    ---------------------------------------
    Mantener únicamente
    las últimas 100 ejecuciones
    ---------------------------------------
    */

    if (

      this.history.length > 100

    ) {

      this.history.pop();

    }

  }

  all():
    RuntimeHistoryEntry[] {

    return [...this.history];

  }

  latest():
    RuntimeHistoryEntry | undefined {

    return this.history[0];

  }

  clear(): void {

    this.history = [];

  }

  stats():
    RuntimeHistoryStats {

    const total =
      this.history.length;

    const successful =
      this.history.filter(

        item => item.success

      ).length;

    const failed =
      total - successful;

    const averageDuration =

      total === 0

        ? 0

        : this.history.reduce(

            (

              total,

              item

            ) =>

              total +

              item.duration,

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

export const runtimeHistoryEngine =
  new RuntimeHistoryEngine();