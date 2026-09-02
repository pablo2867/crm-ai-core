import type {
  ActivityIntelligence,
} from "./activity";

export interface LeadIntelligenceInput {

  email?: string | null;

  phone?: string | null;

  company?: string | null;

  message?: string | null;

  status?: string | null;

  aiScore?: number;

  activities?: number;

  reminders?: number;

}

export interface LeadIntelligenceResult {

  score: number;

  temperature:
    | "HOT"
    | "WARM"
    | "COLD";

  personality:
    | "premium"
    | "urgent"
    | "friendly"
    | "soft";

  priority: number;

  risk:
    | "LOW"
    | "MEDIUM"
    | "HIGH";

  /**
   * Inteligencia derivada del
   * historial de actividades.
   */
  activity?:
    ActivityIntelligence;

}