export interface ExecutiveRisk {

  title: string;

  description: string;

  severity:
    | "low"
    | "medium"
    | "high";

}

export interface ExecutiveOpportunity {

  title: string;

  description: string;

  impact:
    | "low"
    | "medium"
    | "high";

}

export interface ExecutiveRecommendation {

  title: string;

  description: string;

  priority:
    | "low"
    | "medium"
    | "high";

}

export interface ExecutiveHealth {

  overall: number;

  sales: number;

  pipeline: number;

  ai: number;

  growth: number;

}

export interface ExecutiveSummary {

  status:
    | "excellent"
    | "good"
    | "warning"
    | "critical";

  headline: string;

  generatedAt: string;

}

export interface ExecutiveDashboardDTO {

  summary: ExecutiveSummary;

  health: ExecutiveHealth;

  risks: ExecutiveRisk[];

  opportunities: ExecutiveOpportunity[];

  recommendations: ExecutiveRecommendation[];

}