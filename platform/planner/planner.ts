import type {
  PlannerRequest,
  PlannerStep,
  ExecutionPlan,
} from "./types";

export class Planner {

  createPlan(
    request: PlannerRequest
  ): ExecutionPlan {

    /*
    ---------------------------------------
    Workflow
    ---------------------------------------
    */

    const workflow =
      request.workflow;

    /*
    ---------------------------------------
    Planner Steps
    ---------------------------------------
    */

    const steps: PlannerStep[] =

      workflow

        ? workflow.steps.map(

            (step, index) => ({

              id:
                crypto.randomUUID(),

              title:
                step.capability ??
                step.skill ??
                `Step ${index + 1}`,

              description:
                `Execute ${step.capability ?? step.skill}`,

              completed:
                false,

            })

          )

        : [

            {

              id:
                crypto.randomUUID(),

              title:
                "Analyze Request",

              description:
                "No workflow available.",

              completed:
                false,

            },

          ];

    /*
    ---------------------------------------
    Execution
    ---------------------------------------
    */

    const execution =

      workflow

        ? [

            {

              workflowId:
                workflow.id,

              capabilityId:
                workflow.metadata?.capabilityId,

              priority:
                workflow.metadata?.priority ?? 100,

            },

          ]

        : [];

    /*
    ---------------------------------------
    Plan
    ---------------------------------------
    */

    return {

      goal:
        request.message,

      steps,

      execution,

      metadata: {

        createdAt:
          new Date().toISOString(),

        source:
          "planner",

        version:
          1,

      },

    };

  }

}

export const planner =
  new Planner();