export type LeadTemperature =
  | "HOT"
  | "WARM"
  | "COLD";

export type LeadPriority =
  | "HIGH"
  | "MEDIUM"
  | "LOW";

export type LeadRisk =
  | "HIGH"
  | "MEDIUM"
  | "LOW";

export interface LeadAnalysis {

  id: number;

  name: string;

  company?: string | null;

  status?: string | null;

  score: number;

  probability: number;

  revenue: number;

  temperature: LeadTemperature;

  priority: LeadPriority;

  risk: LeadRisk;

  nextAction: string;

  reason: string;

}