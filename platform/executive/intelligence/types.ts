import type {
  BusinessContext,
} from "@/platform/context/business";

export interface ExecutiveOpportunity {

  id: string;

  title: string;

  description: string;

  priority: number;

}

export interface ExecutiveRisk {

  id: string;

  title: string;

  description: string;

  severity: number;

}

export interface ExecutiveRecommendation {

  id: string;

  title: string;

  description: string;

}

export interface ExecutiveInsightReport {

  business: BusinessContext;

  opportunities: ExecutiveOpportunity[];

  risks: ExecutiveRisk[];

  recommendations: ExecutiveRecommendation[];

}