"use client";

import { useEffect, useState } from "react";
import { RadarData } from "@/types/copilot";

export function useCopilotDashboard() {
  const [loading, setLoading] =
    useState(true);

  const [forecastRevenue, setForecastRevenue] =
    useState(0);

  const [hotLeads, setHotLeads] =
    useState(0);

  const [conversionRate, setConversionRate] =
    useState(0);

  const [businessSummary, setBusinessSummary] =
    useState(
      "Generando resumen ejecutivo..."
    );

  const [radarData, setRadarData] =
    useState<RadarData | null>(null);

  async function refresh() {
    try {
      setLoading(true);

      const response =
        await fetch(
          "/api/copilot-dashboard",
          {
            cache: "no-store",
          }
        );

      const data =
        await response.json();

      if (!data.success) {
        return;
      }

      setForecastRevenue(
        data.forecastRevenue || 0
      );

      setHotLeads(
        data.hotLeads || 0
      );

      setConversionRate(
        data.conversionRate || 0
      );

      setBusinessSummary(
        data.summary || ""
      );

      setRadarData({
        bestLead: data.bestLead,
        score: data.score,
        probability:
          data.probability,
        revenue: data.revenue,
        riskLeads:
          data.riskLeads,
      });
    } catch (error) {
      console.error(
        "COPILOT DASHBOARD ERROR:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      void refresh();
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  return {
    loading,
    forecastRevenue,
    hotLeads,
    conversionRate,
    businessSummary,
    radarData,
    refresh,
  };
}

