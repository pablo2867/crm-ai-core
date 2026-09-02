export interface RuntimeHistoryEntry {

  id: string;

  createdAt: Date;

  success: boolean;

  summary: string;

  workflow?: string;

  duration: number;

}

export interface RuntimeHistoryStats {

  totalExecutions: number;

  successfulExecutions: number;

  failedExecutions: number;

  averageDuration: number;

}