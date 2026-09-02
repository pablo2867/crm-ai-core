import type {
  ExecutiveSummary,
} from "../types";

import type {
  ExecutiveBrief,
} from "./types";

export class ExecutiveBriefEngine {

  private mapStatus(
    status: ExecutiveSummary["health"]["status"]
  ): ExecutiveBrief["status"] {

    switch (status) {

      case "healthy":
        return "good";

      case "warning":
        return "warning";

      case "critical":
        return "critical";

      default:
        return "good";

    }

  }

  generate(
    summary: ExecutiveSummary
  ): ExecutiveBrief {

    return {

      title: "Executive Business Brief",

      summary: summary.overview,

      status: this.mapStatus(
        summary.health.status
      ),

      score: summary.health.score,

      highlights: [

        `Leads: ${summary.kpis.totalLeads}`,

        `Conversión: ${summary.kpis.conversionRate}%`,

        `Forecast: $${summary.kpis.forecastRevenue.toLocaleString()}`,

      ],

      priorities:
        summary.priorities,

      risks:
        summary.risks,

      opportunities:
        summary.opportunities,

      nextActions:
        summary.actions,

    };

  }

}

export const executiveBriefEngine =
  new ExecutiveBriefEngine();