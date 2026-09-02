export interface ExecutionResult<T = unknown> {
  success: boolean;
  data: T;
  warnings?: string[];
  executionId?: string;
  durationMs?: number;
}