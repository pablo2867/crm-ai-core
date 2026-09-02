import type {
  Lead,
} from "@/platform/services/lead-service";

import type {
  LeadAnalysis,
} from "./types";

import {
  leadAnalyzer,
} from "@/platform/agents/sales/lead-analyzer";

export class SalesAnalyzer {

  analyze(
    leads: Lead[]
  ): LeadAnalysis[] {

    return leads.map((lead) => {

      /*
      ---------------------------------------
      Fuente única de análisis
      ---------------------------------------
      */

      const analysis =
        leadAnalyzer.analyze(
          lead
        );

      return {

        lead,

        priority:
          analysis.score,

        opportunity:
          analysis.revenue,

        risk:
          analysis.risk === "HIGH"
            ? 100
            : analysis.risk === "MEDIUM"
            ? 50
            : 0,

        reason:
          analysis.reason,

      };

    });

  }

}

export const salesAnalyzer =
  new SalesAnalyzer();