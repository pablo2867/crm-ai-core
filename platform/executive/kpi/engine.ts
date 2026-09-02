import type {
  BusinessContext,
} from "@/platform/context/business";

export interface ExecutiveKPI {

  totalLeads: number;

  activeLeads: number;

  closedDeals: number;

  estimatedRevenue: number;

  forecastRevenue: number;

  conversionRate: number;

}

export class ExecutiveKPIEngine {

  calculate(
    business: BusinessContext
  ): ExecutiveKPI {

    const {

      totalLeads,

      activeLeads,

      closedDeals,

      estimatedRevenue,

      forecastRevenue,

    } = business.metrics;

    const conversionRate =

      totalLeads === 0

        ? 0

        : Math.round(

            (closedDeals / totalLeads) * 100

          );

    return {

      totalLeads,

      activeLeads,

      closedDeals,

      estimatedRevenue,

      forecastRevenue,

      conversionRate,

    };

  }

}

export const executiveKPIEngine =
  new ExecutiveKPIEngine();