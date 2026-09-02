import {
  getDashboardData,
} from "@/lib/dashboard-data";

export class FinanceService {

  async get(
    userId: string
  ) {

    const dashboard =
      await getDashboardData(
        userId
      );

    return {

      estimatedRevenue:
        dashboard.estimatedRevenue,

      forecastRevenue:
        dashboard.forecastRevenue,

      conversionRate:
        dashboard.conversionRate,

      totalLeads:
        dashboard.leads.length,

      hotLeads:
        dashboard.hotLeads,

    };

  }

}

export const financeService =
  new FinanceService();