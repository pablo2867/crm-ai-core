export type PipelinePriority =
  | "LOW"
  | "MEDIUM"
  | "HIGH";

export type PipelineRisk =
  | "LOW"
  | "MEDIUM"
  | "HIGH";

export interface PipelineColumnIntelligence {
  totalLeads: number;

  revenue: number;

  avgScore: number;

  avgProbability: number;

  priority: PipelinePriority;

  risk: PipelineRisk;

  recommendation: string;
}

export interface PipelineIntelligenceRequest {
  leads: Array<Record<string, unknown>>;
}