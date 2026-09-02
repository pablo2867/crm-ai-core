import type {
  ExecutiveHealth,
} from "./dto";

import type {
  ExecutiveRepositoryData,
} from "./repository";

export class ExecutiveScorer {

  calculate(
    data: ExecutiveRepositoryData
  ): ExecutiveHealth {

    const summary =
      data.analytics.summary;

    const sales =
      Math.min(
        100,
        summary.successRate
      );

    const pipeline =
      Math.min(
        100,
        data.leads.length * 5
      );

    const ai =
      Math.min(
        100,
        summary.successRate
      );

    const growth =
      Math.min(
        100,
        (summary.totalExecutions / 10) * 100
      );

    const overall =

      Math.round(

        (

          sales +

          pipeline +

          ai +

          growth

        ) / 4

      );

    return {

      overall,

      sales,

      pipeline,

      ai,

      growth,

    };

  }

}

export const executiveScorer =
  new ExecutiveScorer();