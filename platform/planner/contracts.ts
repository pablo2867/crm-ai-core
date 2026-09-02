export interface PlanExecution {

  workflowId: string;

  capabilityId?: string;

  priority: number;

}

export interface PlannerDecision {

  goal: string;

  execution: PlanExecution[];

  metadata: {

    createdAt: string;

    source: "planner";

    version: 1;

  };

}