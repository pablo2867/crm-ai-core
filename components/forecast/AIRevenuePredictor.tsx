"use client";

import { useEffect, useState } from "react";

interface RevenueData {
  forecastRevenue: number;
  bestLead: string;
  probability: number;
  revenue: number;
  riskLeads: number;
}

export default function AIRevenuePredictor() {
  const [data, setData] =
    useState<RevenueData | null>(
      null
    );

  useEffect(() => {
    async function load() {
      try {
        const response =
          await fetch(
            "/api/copilot-dashboard",
            {
              cache: "no-store",
            }
          );

        const result =
          await response.json();

        if (
          result.success
        ) {
          setData({
            forecastRevenue:
              result.forecastRevenue,
            bestLead:
              result.bestLead,
            probability:
              result.probability,
            revenue:
              result.revenue,
            riskLeads:
              result.riskLeads,
          });
        }
      } catch (error) {
        console.error(
          error
        );
      }
    }

    load();
  }, []);

  if (!data) {
    return null;
  }

  return (
    <div
      className="
        mt-10
        bg-[#111113]
        border
        border-zinc-800
        rounded-3xl
        p-6
      "
    >
      <p className="text-zinc-500 text-sm">
        AI Revenue Predictor
      </p>

      <h2 className="text-3xl font-black mt-2">
        Executive Forecast
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div>
          <p className="text-zinc-400">
            Forecast Revenue
          </p>

          <h3 className="text-3xl font-black mt-2">
            $
            {data.forecastRevenue.toLocaleString()}
          </h3>
        </div>

        <div>
          <p className="text-zinc-400">
            Best Opportunity
          </p>

          <h3 className="text-xl font-bold mt-2">
            {data.bestLead}
          </h3>

          <p className="text-emerald-400">
            {data.probability}% cierre
          </p>

          <p>
            $
            {data.revenue.toLocaleString()}
          </p>
        </div>

        <div>
          <p className="text-zinc-400">
            Leads at Risk
          </p>

          <h3 className="text-3xl font-black mt-2 text-red-400">
            {data.riskLeads}
          </h3>
        </div>
      </div>
    </div>
  );
}