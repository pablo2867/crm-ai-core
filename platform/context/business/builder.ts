import type {
  ContextLead,
} from "@/platform/context";

import {
  businessMetricsProvider,
} from "./metrics";

import {
  businessHealthCalculator,
} from "./health/calculator";

import type {
  BusinessContext,
} from "./types";

export class BusinessContextBuilder {

  async build(
    leads: ContextLead[] = []
  ): Promise<BusinessContext> {

    const metrics =
      await businessMetricsProvider.get(
        leads
      );

    const health =
      businessHealthCalculator.calculate({

        conversionRate:
          metrics.conversionRate,

      });

    return {

      metrics: {

        totalLeads:
          metrics.totalLeads,

        activeLeads:
          metrics.activeLeads,

        closedDeals:
          metrics.closedDeals,

        estimatedRevenue:
          metrics.estimatedRevenue,

        forecastRevenue:
          metrics.forecastRevenue,

      },

      health,

      metadata: {

        generatedAt:
          new Date().toISOString(),

      },

    };

  }

}

export const businessContextBuilder =
  new BusinessContextBuilder();