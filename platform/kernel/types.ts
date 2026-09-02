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

export interface KernelRequest {
  message: string;
  intent: string;

  userId?: string;
  leadId?: number;

  organizationId?: string;
  workspaceId?: string;
  moduleId?: string;

  context?: Record<string, unknown>;
}

export interface KernelSummary {
  success?: boolean;
  provider?: string;
  model?: string;
  text: string;
}

export interface KernelResponse {
  handled: boolean;

  decision: DecisionResponse;

  plan: ExecutionPlan | null;

  workflow: WorkflowResult | null;

  validation: ValidationEngineResult | null;

  agent: unknown;

  summary: KernelSummary;
}
