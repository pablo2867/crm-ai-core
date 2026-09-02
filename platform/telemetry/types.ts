export interface TelemetryRecord {

  agentId: string;

  workflow?: string;

  intent?: string;

  startedAt: Date;

  finishedAt: Date;

  duration: number;

  success: boolean;

  tokens?: number;

  memoryReads?: number;

  memoryWrites?: number;

}

export interface TelemetrySummary {

  totalExecutions: number;

  successfulExecutions: number;

  failedExecutions: number;

  averageDuration: number;

}