import type {
  Workflow,
} from "@/platform/workflows";

import type {
  DecisionContext,
} from "./context";

import {
  scoreIntent,
} from "./scoring/intent";

import {
  scorePriority,
} from "./scoring/priority";

import {
  scoreLead,
} from "./scoring/lead";

import {
  scoreMemory,
} from "./scoring/memory";

import {
  scorePipeline,
} from "./scoring/pipeline";

import {
  scoreRules,
} from "./scoring/rules";

export interface WorkflowScoreBreakdown {

  intent: number;

  priority: number;

  lead: number;

  memory: number;

  pipeline: number;

  rules: number;

  total: number;

}

export interface WorkflowScore {

  workflow: Workflow;

  score: number;

  breakdown: WorkflowScoreBreakdown;

}

export interface ScoreWorkflowsRequest {

  workflows: Workflow[];

  context: DecisionContext;

}

export function scoreWorkflows({

  workflows,

  context,

}: ScoreWorkflowsRequest): WorkflowScore[] {

  return workflows.map(

    (workflow) => {

      const intent =
        scoreIntent(
          workflow,
          context
        );

      const priority =
        scorePriority(
          workflow
        );

      const lead =
        scoreLead(
          context,
          workflow
        );

      const memory =
        scoreMemory(
          context,
          workflow
        );

      const pipeline =
        scorePipeline(
          context
        );

      const rules =
        scoreRules(
          context
        );

      const breakdown:
        WorkflowScoreBreakdown = {

        intent:
          intent.score,

        priority:
          priority.score,

        lead:
          lead.score,

        memory:
          memory.score,

        pipeline:
          pipeline.score,

        rules:
          rules.score,

        total: 0,

      };

      breakdown.total =

        breakdown.intent +

        breakdown.priority +

        breakdown.lead +

        breakdown.memory +

        breakdown.pipeline +

        breakdown.rules;

      return {

        workflow,

        score:
          breakdown.total,

        breakdown,

      };

    }

  );

}
