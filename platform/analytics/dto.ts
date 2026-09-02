/*
---------------------------------------
Analytics Dashboard DTO
---------------------------------------
*/

export interface AnalyticsSummaryDTO {

  totalExecutions: number;

  successfulExecutions: number;

  failedExecutions: number;

  successRate: number;

  averageDuration: number;

  mostUsedAgent?: string;

}

/*
---------------------------------------
Top Agent
---------------------------------------
*/

export interface TopAgentDTO {

  agent: string;

  executions: number;

}

/*
---------------------------------------
Timeline
---------------------------------------
*/

export interface AnalyticsTimelineDTO {

  date: string;

  executions: number;

}

/*
---------------------------------------
Recent Execution
---------------------------------------
*/

export interface RecentExecutionDTO {

  agent_id: string;

  workflow?: string | null;

  intent?: string | null;

  duration: number;

  success: boolean;

  started_at: string;

  finished_at: string;

  tokens?: number | null;

  memory_reads?: number | null;

  memory_writes?: number | null;

}

/*
---------------------------------------
Analytics Dashboard
---------------------------------------
*/

export interface AnalyticsDashboardDTO {

  summary: AnalyticsSummaryDTO;

  topAgents: TopAgentDTO[];

  timeline: AnalyticsTimelineDTO[];

  recentExecutions: RecentExecutionDTO[];

}