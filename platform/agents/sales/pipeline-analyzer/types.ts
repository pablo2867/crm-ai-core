import type {
  LeadAnalysis,
} from "../lead-analyzer";

export interface PipelineAnalysis {

  totalLeads: number;

  hotLeads: number;

  warmLeads: number;

  coldLeads: number;

  highPriority: number;

  mediumPriority: number;

  lowPriority: number;

  totalRevenue: number;

  averageScore: number;

  averageProbability: number;

  highRisk: number;

  mediumRisk: number;

  lowRisk: number;

  bestLead?: LeadAnalysis;

  worstLead?: LeadAnalysis;

  recommendations: string[];

}