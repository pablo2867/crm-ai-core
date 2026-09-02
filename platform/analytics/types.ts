export interface AnalyticsSummary {

  totalExecutions: number;

  successfulExecutions: number;

  failedExecutions: number;

  successRate: number;

  averageDuration: number;

  mostUsedAgent?: string;

  mostUsedIntent?: string;

  slowestAgent?: string;

}

export interface AnalyticsResult {

  summary: AnalyticsSummary;

}