export interface SchedulerDecision {

  shouldRun: boolean;

  reason: string;

}

export class AISalesManagerScheduler {

  shouldExecute(): SchedulerDecision {

    return {

      shouldRun: true,

      reason:
        "Manual execution.",

    };

  }

}

export const aiSalesManagerScheduler =
  new AISalesManagerScheduler();