import type {
  DecisionResponse,
} from "@/platform/decision";

import type {
  DecisionExplanation,
} from "@/platform/decision/explanation";

import type {
  KernelResponse,
} from "@/platform/kernel";

import type {
  ExecutionPlan,
} from "@/platform/planner";

import type {
  ValidationEngineResult,
} from "@/platform/validation";

import type {
  WorkflowResult,
} from "@/platform/workflows";

export interface RuntimeMetric {

  id: string;

  duration: number;

  success?: boolean;

}

export interface RuntimeStep {

  id: string;

  name: string;

  status:
    | "pending"
    | "running"
    | "completed"
    | "failed";

}

export interface RuntimeRequest {

  /*
  ---------------------------------------
  Mensaje
  ---------------------------------------
  */

  message: string;

  intent: string;

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
  Contexto adicional
  ---------------------------------------
  */

  context?: Record<
    string,
    unknown
  >;

}

export interface RuntimeResult {

  success: boolean;

  summary: string;

  steps: RuntimeStep[];

  metrics: RuntimeMetric[];

  /*
  ---------------------------------------
  Kernel completo
  ---------------------------------------
  */

  output?: KernelResponse;

  /*
  ---------------------------------------
  Accesos rápidos
  ---------------------------------------
  */

  decision?: DecisionResponse;

  workflow?: WorkflowResult | null;

  plan?: ExecutionPlan | null;

  validation?: ValidationEngineResult | null;

  explanation?: DecisionExplanation;

}