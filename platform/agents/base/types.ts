import type {
  AgentRequest,
} from "@/platform/agents/contracts";

export type BaseAgentRequest = AgentRequest;

export interface BaseAgentContext {

  userId?: string;

  memory?: unknown[];

  metadata?: Record<string, unknown>;

}

export interface BaseAgentResult<T = unknown> {

  success: boolean;

  data: T;

  executionTime: number;

}

export interface AgentHooks {

  beforeExecute?(
    request: BaseAgentRequest
  ): Promise<void>;

  afterExecute?(
    result: BaseAgentResult
  ): Promise<void>;

}
