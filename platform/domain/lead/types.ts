export type LeadTemperature =
  | "HOT"
  | "WARM"
  | "COLD";

export interface Reminder {

  completed?: boolean;

  [key: string]: unknown;

}

/*
---------------------------------------
Lead Activity
---------------------------------------
Representa cualquier interacción
realizada sobre un lead.
---------------------------------------
*/

export interface LeadActivity {

  id: string;

  type:
    | "followup"
    | "email"
    | "call"
    | "meeting"
    | "task"
    | "note"
    | "system";

  createdAt: string;

  description?: string;

  userId?: string;

  metadata?: Record<string, unknown>;

}

export interface Lead {

  id: number;

  user_id: string;

  name: string;

  company: string | null;

  email: string | null;

  phone?: string | null;

  status?: string | null;

  ai_score: number;

  ai_temperature:
    | LeadTemperature
    | string
    | null;

  ai_personality?: string | null;

  ai_analysis?: string | null;

  ai_followup?: string | null;

  ai_followup_result?: string | null;

  close_probability: number;

  estimated_revenue: number;

  pipeline_stage?: string | null;

  pipeline_stage_order?: number | null;

  activities?: LeadActivity[];

  ai_notes?: unknown[];

  reminders?: Reminder[];

  lead_notes?: unknown[];

  created_at?: string;

}
