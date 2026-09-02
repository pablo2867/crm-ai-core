"use client";

import { useAICommandCenter } from "@/hooks/useAICommandCenter";

import SystemHealth from "../SystemHealth";
import PerformanceCard from "../PerformanceCard";
import AIStatusCard from "../AIStatusCard";
import RuntimeMonitor from "../RuntimeMonitor";
import DecisionMonitor from "../DecisionMonitor";

interface DiagnosticsGridProps {

  skills: number;

  workflows: number;

  agents: number;

}

export default function DiagnosticsGrid({

  skills,

  workflows,

  agents,

}: DiagnosticsGridProps) {

  const {
    data,
    loading,
  } = useAICommandCenter();

  return (

    <div
      className="
        grid
        grid-cols-1
        xl:grid-cols-2
        gap-6
      "
    >

      <SystemHealth
        data={data}
        loading={loading}
      />

      <PerformanceCard
        data={data}
        loading={loading}
      />

      <AIStatusCard

        skills={skills}

        workflows={workflows}

        agents={agents}

      />

      <RuntimeMonitor
        data={data}
        loading={loading}
      />

      <DecisionMonitor
        data={data}
        loading={loading}
      />

    </div>

  );

}
