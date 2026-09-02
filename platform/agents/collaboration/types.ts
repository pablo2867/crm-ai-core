import type {
  AgentResult,
} from "@/platform/agents/contracts";

export interface CollaborationStep {

  agentId: string;

  intent: string;

}

export interface CollaborationRequest {

  steps: CollaborationStep[];

  context: Record<string, unknown>;

}

export interface CollaborationExecution {

  agentId: string;

  success: boolean;

  result: AgentResult;

  startedAt: number;

  finishedAt: number;

  duration: number;

}

export interface CollaborationSummary {

  totalAgents: number;

  successfulAgents: number;

  failedAgents: number;

  totalDuration: number;

}

export interface CollaborationResult {

  success: boolean;

  executions: CollaborationExecution[];

  summary: CollaborationSummary;

}