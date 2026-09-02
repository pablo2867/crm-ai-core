"use client";

import {
  useAICommandCenter,
} from "@/hooks/useAICommandCenter";

import {
  DecisionCard,
} from "./DecisionCard";

import {
  ValidationCard,
} from "./ValidationCard";

import {
  WorkflowCard,
} from "./WorkflowCard";

import {
  PlannerCard,
} from "./PlannerCard";

import {
  RuntimeCard,
} from "./RuntimeCard";

import {
  TimelineCard,
} from "./TimelineCard";

import {
  MetricsCard,
} from "./MetricsCard";

import {
  ExecutionHistoryCard,
} from "./ExecutionHistoryCard";

import {
  ExplanationCard,
} from "./ExplanationCard";

import {
  HealthCard,
} from "./HealthCard";

export function AICommandCenter() {

  const {

    data,

    loading,

    refresh,

  } = useAICommandCenter();

  if (loading) {

    return (

      <div
        className="
          rounded-3xl
          border
          border-zinc-800
          bg-[#111113]
          p-6
          mb-6
        "
      >

        <p className="text-zinc-400">

          Cargando AI Command Center...

        </p>

      </div>

    );

  }

  return (

    <section
      className="
        rounded-3xl
        border
        border-zinc-800
        bg-[#111113]
        p-6
        mb-6
      "
    >

      <div
        className="
          flex
          justify-between
          items-center
          mb-6
        "
      >

        <div>

          <h2
            className="
              text-xl
              font-semibold
            "
          >

            AI Command Center

          </h2>

          <p
            className="
              text-zinc-400
              text-sm
            "
          >

            Estado interno del Runtime.

          </p>

        </div>

        <button

          onClick={refresh}

          className="
            rounded-xl
            border
            border-zinc-700
            px-4
            py-2
            text-sm
            hover:bg-zinc-800
          "

        >

          Actualizar

        </button>

      </div>

      <div
        className="
          grid
          gap-5
          xl:grid-cols-2
        "
      >

        <DecisionCard
          decision={data.decision}
        />

        <ExplanationCard
          explanation={data.explanation}
        />

        <HealthCard
          health={data.health}
        />

        <ValidationCard
          validation={data.validation}
        />

        <WorkflowCard
          workflow={data.workflow}
        />

        <PlannerCard
          plan={data.plan}
        />

        <RuntimeCard
          runtime={data.runtime}
        />

        <TimelineCard
          runtime={data.runtime}
        />

        <MetricsCard
          metrics={data.metrics}
        />

        <ExecutionHistoryCard
          history={data.history}
          stats={data.historyStats}
        />

      </div>

    </section>

  );

}

export default AICommandCenter;