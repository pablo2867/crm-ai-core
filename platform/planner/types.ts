import type {
  Workflow,
} from "@/platform/workflows";

import type {
  PlanExecution,
} from "./contracts";

/*
---------------------------------------
Planner Registry Step
---------------------------------------
*/

export interface PlanStep {

  id: string;

  name: string;

  action: string;

}

/*
---------------------------------------
Planner UI Step
---------------------------------------
*/

export interface PlannerStep {

  id: string;

  title: string;

  description: string;

  completed: boolean;

}

/*
---------------------------------------
Planner Request
---------------------------------------
*/

export interface PlannerRequest {

  /*
  ---------------------------------------
  Solicitud
  ---------------------------------------
  */

  message: string;

  intent: string;

  workflow?: Workflow;

  /*
  ---------------------------------------
  Identidad
  ---------------------------------------
  */

  userId?: string;

  leadId?: number;

  /*
  ---------------------------------------
  Multi Tenant
  ---------------------------------------
  */

  organizationId?: string;

  workspaceId?: string;

  moduleId?: string;

  /*
  ---------------------------------------
  Contexto
  ---------------------------------------
  */

  context?: Record<
    string,
    unknown
  >;

}

/*
---------------------------------------
Execution Plan
---------------------------------------
*/

export interface ExecutionPlan {

  goal: string;

  steps: PlannerStep[];

  execution: PlanExecution[];

  metadata: {

    createdAt: string;

    source: "planner";

    version: 1;

  };

}

/*
---------------------------------------
Runtime
---------------------------------------
*/

export type ExecutionStep = PlanExecution;

export type {
  PlanExecution,
};
