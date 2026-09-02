import type {
  CopilotMessage,
} from "@/types/copilot";

import type {
  DecisionResponse,
} from "@/platform/decision";

import type {
  RuntimeResult,
} from "@/platform/runtime";

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

export interface AICommandCenterProps {

  message?: CopilotMessage;

}

export interface DecisionCardProps {

  decision?: DecisionResponse | null;

}

export interface WorkflowCardProps {

  workflow?: WorkflowResult | null;

}

export interface PlannerCardProps {

  plan?: ExecutionPlan | null;

}

export interface ValidationCardProps {

  validation?:
    | ValidationEngineResult
    | null;

}

export interface RuntimeCardProps {

  runtime?: RuntimeResult | null;

}

export interface TimelineCardProps {

  runtime?: RuntimeResult | null;

}

export interface ExplanationCardProps {

  explanation?:
    | DecisionExplanation
    | null
    | undefined;

}