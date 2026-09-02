export interface ExecutionSession {
  executionId: string;
  workflowId?: string;
  workflowName?: string;
  agent?: string;
  userId?: string;
  startedAt: Date;
  finishedAt?: Date;
}