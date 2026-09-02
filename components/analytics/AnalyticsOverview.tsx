"use client";

import {

  useEffect,

  useState,

} from "react";

import type {

  AnalyticsDashboardDTO,

} from "@/platform/analytics/dto";

import AnalyticsCards from "./AnalyticsCards";
import AnalyticsAgents from "./AnalyticsAgents";
import AnalyticsTimeline from "./AnalyticsTimeline";
import AnalyticsRecent from "./AnalyticsRecent";
import AnalyticsHealth from "./AnalyticsHealth";

export default function AnalyticsOverview() {

  const [

    analytics,

    setAnalytics,

  ] =
    useState<
      AnalyticsDashboardDTO | null
    >(null);

  const [

    loading,

    setLoading,

  ] =
    useState(true);

  useEffect(() => {

    async function load() {

      try {

        const response =
          await fetch(
            "/api/analytics"
          );

        const json =
          await response.json();

        setAnalytics(
          json.analytics
        );

      } catch (

        error

      ) {

        console.error(
          error
        );

      } finally {

        setLoading(
          false
        );

      }

    }

    load();

  }, []);

  if (loading) {

    return (

      <div
        className="
          bg-[#111113]
          border
          border-zinc-800
          rounded-3xl
          p-6
          mt-10
        "
      >

        Cargando Analytics...

      </div>

    );

  }

  if (!analytics) {

    return null;

  }

  return (

    <div className="mt-10 space-y-8">

      <AnalyticsCards
        analytics={analytics}
      />

      <div
        className="
          grid
          grid-cols-1
          xl:grid-cols-2
          gap-8
        "
      >

        <AnalyticsAgents
          analytics={analytics}
        />

        <AnalyticsHealth
          analytics={analytics}
        />

      </div>

      <AnalyticsTimeline
        analytics={analytics}
      />

      <AnalyticsRecent
        analytics={analytics}
      />

    </div>

  );

}