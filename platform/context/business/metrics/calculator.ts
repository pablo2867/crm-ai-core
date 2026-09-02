import type {
  ContextLead,
} from "@/platform/context";

import type {
  BusinessMetricsData,
} from "./types";

export class BusinessMetricsCalculator {

  calculate(
    leads: ContextLead[]
  ): BusinessMetricsData {

    const totalLeads =
      leads.length;

    const closedDeals =
      leads.filter(
        (lead) => {

          if (
            lead.pipeline_stage ===
            "closed_won"
          ) {
            return true;
          }

          return (
            typeof lead.status ===
              "string" &&
            lead.status
              .trim()
              .toLowerCase() ===
              "cerrado"
          );

        }
      ).length;

    const activeLeads =
      totalLeads -
      closedDeals;

    const estimatedRevenue =
      leads.reduce(
        (sum, lead) =>
          sum +
          Number(
            lead.estimated_revenue ??
            0
          ),
        0
      );

    const forecastRevenue =
      leads.reduce(
        (sum, lead) => {

          const revenue =
            Number(
              lead.estimated_revenue ??
              0
            );

          const probability =
            Number(
              lead.close_probability ??
              0
            );

          return (
            sum +
            (
              revenue *
              probability
            ) / 100
          );

        },
        0
      );

    const conversionRate =
      totalLeads === 0
        ? 0
        : (
            closedDeals /
            totalLeads
          ) * 100;

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

export const businessMetricsCalculator =
  new BusinessMetricsCalculator();
