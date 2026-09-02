"use client";

import {
  useEffect,
  useState,
} from "react";

interface RuntimeResponse {

  success: boolean;

  orchestration?: {

    success: boolean;

    executionTime: number;

    orchestrator: string;

  };

  health?: {

    score?: number;

    status?: string;

  };

}

export default function RuntimeStatus() {

  const [

    data,

    setData,

  ] =
    useState<RuntimeResponse | null>(
      null
    );

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
            "/api/ai-command-center"
          );

        const json =
          await response.json();

        setData(
          json
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
          mt-10
          bg-[#111113]
          border
          border-zinc-800
          rounded-3xl
          p-6
        "
      >

        Cargando Executive Board...

      </div>

    );

  }

  return (

    <section
      className="
        mt-10
        bg-[#111113]
        border
        border-zinc-800
        rounded-3xl
        p-8
      "
    >

      <div className="mb-8">

        <p className="text-zinc-500 text-sm">
          AI Command Center
        </p>

        <h2 className="text-3xl font-black mt-2">
          Executive Board
        </h2>

      </div>

      <div className="space-y-4">

        <div className="flex justify-between">

          <span>Runtime</span>

          <span className="text-emerald-400">

            {data?.success
              ? "ONLINE"
              : "OFFLINE"}

          </span>

        </div>

        <div className="flex justify-between">

          <span>Orchestrator</span>

          <span>

            {data?.orchestration
              ?.orchestrator ??
              "AI CORE"}

          </span>

        </div>

        <div className="flex justify-between">

          <span>Execution Time</span>

          <span>

            {data?.orchestration
              ?.executionTime ?? 0}
            ms

          </span>

        </div>

        <div className="flex justify-between">

          <span>Health</span>

          <span className="text-emerald-400">

            {data?.health?.status ??
              "HEALTHY"}

          </span>

        </div>

      </div>

      <div
        className="
          mt-8
          pt-6
          border-t
          border-zinc-800
        "
      >

        <h3 className="font-bold text-lg mb-4">
          Active Agents
        </h3>

        <div className="space-y-3">

          <div className="flex justify-between">

            <span>CEO Agent</span>

            <span className="text-emerald-400">
              READY
            </span>

          </div>

          <div className="flex justify-between">

            <span>Sales Agent</span>

            <span className="text-emerald-400">
              READY
            </span>

          </div>

          <div className="flex justify-between">

            <span>Marketing Agent</span>

            <span className="text-emerald-400">
              READY
            </span>

          </div>

          <div className="flex justify-between">

            <span>Finance Agent</span>

            <span className="text-emerald-400">
              READY
            </span>

          </div>

          <div className="flex justify-between">

            <span>Support Agent</span>

            <span className="text-yellow-400">
              STANDBY
            </span>

          </div>

          <div className="flex justify-between">

            <span>HR Agent</span>

            <span className="text-yellow-400">
              STANDBY
            </span>

          </div>

        </div>

      </div>

    </section>

  );

}