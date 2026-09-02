"use client";

import {
  useEffect,
  useState,
} from "react";

interface TelemetryRecord {
  agentId: string;
  intent?: string;
  workflow?: string;
  duration: number;
  success: boolean;
}

interface TelemetryResponse {
  success: boolean;
  telemetry: TelemetryRecord[];
  summary: {
    totalExecutions: number;
    successfulExecutions: number;
    failedExecutions: number;
    averageDuration: number;
  };
}

export default function AgentMonitor() {

  const [
    data,
    setData,
  ] =
    useState<TelemetryResponse | null>(
      null
    );

  useEffect(() => {

    async function load() {

      const response =
        await fetch(
          "/api/ai-telemetry"
        );

      const json =
        await response.json();

      setData(
        json
      );

    }

    load();

  }, []);

  if (!data) {

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

        Cargando telemetría...

      </div>

    );

  }

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

      <h2 className="text-2xl font-black">

        Agent Monitor

      </h2>

      <div className="grid grid-cols-2 gap-4 mt-6">

        <div>

          <p className="text-zinc-500">

            Ejecuciones

          </p>

          <p className="text-3xl font-bold">

            {data.summary.totalExecutions}

          </p>

        </div>

        <div>

          <p className="text-zinc-500">

            Promedio

          </p>

          <p className="text-3xl font-bold">

            {Math.round(
              data.summary.averageDuration
            )} ms

          </p>

        </div>

        <div>

          <p className="text-emerald-400">

            Exitosas

          </p>

          <p className="text-2xl font-bold">

            {data.summary.successfulExecutions}

          </p>

        </div>

        <div>

          <p className="text-red-400">

            Fallidas

          </p>

          <p className="text-2xl font-bold">

            {data.summary.failedExecutions}

          </p>

        </div>

      </div>

      <div className="mt-8 space-y-3">

        {data.telemetry
          .slice()
          .reverse()
          .map((item, index) => (

            <div
              key={index}
              className="
                flex
                justify-between
                border-b
                border-zinc-800
                pb-2
              "
            >

              <div>

                <p className="font-semibold">

                  {item.agentId}

                </p>

                <p className="text-xs text-zinc-500">

                  {item.intent}

                </p>

              </div>

              <div className="text-right">

                <p>

                  {item.duration} ms

                </p>

                <p
                  className={
                    item.success
                      ? "text-emerald-400"
                      : "text-red-400"
                  }
                >

                  {item.success
                    ? "OK"
                    : "ERROR"}

                </p>

              </div>

            </div>

          ))}

      </div>

    </div>

  );

}