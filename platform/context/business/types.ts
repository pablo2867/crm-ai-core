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

  metadata?: Record<string, unknown>;

}