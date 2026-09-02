export type AIHealthStatus =
  | "healthy"
  | "warning"
  | "critical";

export interface AIHealthComponent {

  id: string;

  name: string;

  status: AIHealthStatus;

  score: number;

  averageDuration: number;

  executions: number;

  successRate: number;

  message: string;

  recommendation?: string;

}

export interface AIHealthReport {

  overallScore: number;

  overallStatus: AIHealthStatus;

  generatedAt: string;

  components: AIHealthComponent[];

}

export interface AIHealthBuilderRequest {

  components: AIHealthComponent[];

}