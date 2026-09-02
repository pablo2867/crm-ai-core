import type {
  Lead,
} from "@/platform/services/lead-service";

import type {
  ActionType,
} from "@/platform/actions";

export interface LeadAnalysis {

  lead: Lead;

  priority: number;

  risk: number;

  opportunity: number;

  reason: string;

}

export interface SalesDecision {

  lead: Lead;

  action: ActionType;

  confidence: number;

  reason: string;

}

export interface SalesExecutionResult {

  success: boolean;

  analyzed: number;

  executed: number;

  decisions: SalesDecision[];

}