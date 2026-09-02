export interface DecisionReason {

  title: string;

  description: string;

  weight: number;

}

export interface DecisionExplanation {

  workflowId: string;

  workflowName: string;

  finalScore: number;

  confidence: number;

  reasons: DecisionReason[];

  summary: string;

}

export interface DecisionExplanationRequest {

  workflowId: string;

  workflowName: string;

  finalScore: number;

  confidence: number;

  reasons: DecisionReason[];

  /*
  ---------------------------------------
  Explainable AI (Optional Context)
  ---------------------------------------
  */

  intent?: string;

  decisionContext?: Record<string, unknown>;

  selectedScore?: number;

}