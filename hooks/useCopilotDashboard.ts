"use client";

import { useEffect, useState } from "react";
import { RadarData } from "@/types/copilot";

type CopilotLead = {
  id?: string | number;
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  ai_score?: number;
  ai_temperature?: string;
  close_probability?: number;
  estimated_revenue?: number;
  status?: string;
};

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

      const bestLead =
        data.bestLead as CopilotLead | null;

      setRadarData({
        bestLead:
          bestLead?.name ||
          "Sin datos",
        score:
          data.score || 0,
        probability:
          data.probability || 0,
        revenue:
          data.revenue || 0,
        riskLeads:
          data.riskLeads || 0,
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
