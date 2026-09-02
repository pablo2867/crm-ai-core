export interface BusinessMetrics {

  totalLeads: number;

  activeLeads: number;

  closedDeals: number;

  estimatedRevenue: number;

  forecastRevenue: number;

}

export interface BusinessHealth {

  score: number;

  status:
    | "excellent"
    | "good"
    | "warning"
    | "critical";

}

export interface BusinessContext {

  metrics: BusinessMetrics;

  health: BusinessHealth;

}

export interface ContextUser {

  id: string;

  organizationId?: string;

  workspaceId?: string;

}

export interface ContextLead {

  id: number;

  name: string;

  company?: string | null;

  status?: string | null;

  pipeline_stage?: string | null;

  ai_score?: number | null;

  ai_temperature?: string | null;

  estimated_revenue?: number | null;

  close_probability?: number | null;

}

export interface ContextActivity {

  id?: number;

  type?: string;

  description?: string;

}

export interface ContextReminder {

  id?: number;

  title?: string;

  completed?: boolean;

}

export interface AIContext {

  user: ContextUser;

  leads: ContextLead[];

  bestLead?: ContextLead;

  activities: ContextActivity[];

  reminders: ContextReminder[];

  business: BusinessContext;

  metadata: {

    generatedAt: string;

  };

}


