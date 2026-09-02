import type {
  MetricRecord,
  MetricReport,
} from "./types";

export class AIMetricsEngine {

  private metrics =
    new Map<
      string,
      MetricRecord
    >();

  start(
    id: string,
    name?: string,
    category = "Runtime"
  ): void {

    /*
    ---------------------------------------
    Evitar reiniciar una métrica existente
    ---------------------------------------
    */

    if (this.metrics.has(id)) {

      return;

    }

    this.metrics.set(

      id,

      {

        id,

        name:
          name ?? id,

        category,

        status:
          "running",

        startedAt:
          performance.now(),

      }

    );

  }

  finish(
    id: string,
    status: MetricRecord["status"] = "completed"
  ): void {

    const metric =
      this.metrics.get(id);

    if (!metric) {

      return;

    }

    metric.finishedAt =
      performance.now();

    metric.status =
      status;

  }

  fail(
    id: string
  ): void {

    this.finish(
      id,
      "failed"
    );

  }

  duration(
    id: string
  ): number {

    const metric =
      this.metrics.get(id);

    if (

      !metric ||

      metric.finishedAt ===
      undefined

    ) {

      return 0;

    }

    return (

      metric.finishedAt -

      metric.startedAt

    );

  }

  report():
    MetricReport[] {

    return Array.from(

      this.metrics.values()

    ).map(

      (metric) => ({

        id:
          metric.id,

        name:
          metric.name,

        category:
          metric.category,

        status:
          metric.status,

        duration:

          metric.finishedAt !==
          undefined

            ? metric.finishedAt -

              metric.startedAt

            : 0,

      })

    );

  }

  clear(): void {

    this.metrics.clear();

  }

}

export const aiMetricsEngine =
  new AIMetricsEngine();
