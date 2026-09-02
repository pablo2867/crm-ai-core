import type {
  RuntimeResult,
} from "@/platform/runtime";

import type {
  DecisionResponse,
} from "@/platform/decision";

import type {
  WorkflowResult,
} from "@/platform/workflows";

import type {
  ExecutionPlan,
} from "@/platform/planner";

import type {
  ValidationEngineResult,
} from "@/platform/validation";

import type {
  DecisionExplanation,
} from "@/platform/decision/explanation";

export interface CopilotResponse {

  success: boolean;

  answer: string;

  runtime?: RuntimeResult;

  decision?: DecisionResponse;

  workflow?: WorkflowResult | null;

  plan?: ExecutionPlan | null;

  validation?: ValidationEngineResult | null;

  explanation?: DecisionExplanation;

}

export interface CopilotHandledResponse {

  handled: boolean;

  result?: CopilotResponse;

}