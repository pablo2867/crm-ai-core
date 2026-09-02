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

export interface CopilotMessage {

  role:
    | "user"
    | "assistant";

  content: string;

  /**
   * Runtime completo.
   */
  runtime?: RuntimeResult;

  /**
   * Resultado del Decision Engine.
   */
  decision?: DecisionResponse;

  /**
   * Workflow ejecutado.
   */
  workflow?: WorkflowResult | null;

  /**
   * Plan generado.
   */
  plan?: ExecutionPlan | null;

  /**
   * Resultado del Validation Engine.
   */
  validation?:
    | ValidationEngineResult
    | null;

  /**
   * Explicación estructurada
   * del Decision Engine.
   */
  explanation?:
    | DecisionExplanation
    | undefined;

}

export interface RadarData {

  bestLead?: string;

  score?: number;

  probability?: number;

  revenue?: number;

  riskLeads?: number;

}

export interface AnalyticsDataPoint {

  name: string;

  total: number;

}