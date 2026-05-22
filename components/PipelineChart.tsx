"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function PipelineChart({
  filtered,
}: any) {

  const chartData = [

    {
      name: "HOT",
      value:

        filtered.filter(
          (lead: any) =>
            lead.ai_temperature === "HOT"
        ).length,
    },

    {
      name: "WARM",
      value:

        filtered.filter(
          (lead: any) =>
            lead.ai_temperature === "WARM"
        ).length,
    },

    {
      name: "COLD",
      value:

        filtered.filter(
          (lead: any) =>
            lead.ai_temperature === "COLD"
        ).length,
    },

  ];

  const COLORS = [
    "#ef4444",
    "#eab308",
    "#3b82f6",
  ];

  return (

    <div
      className="
        bg-white
        dark:bg-[#111113]

        border
        border-zinc-200
        dark:border-zinc-800

        rounded-3xl

        p-6

        mb-10
      "
    >

      <div className="flex items-center justify-between mb-6">

        <div>

          <p className="text-zinc-500 text-sm">
            Distribución IA
          </p>

          <h2
            className="
              text-2xl
              font-black
              text-black
              dark:text-white
              mt-1
            "
          >
            HOT vs WARM vs COLD
          </h2>

        </div>

      </div>

      <div className="w-full h-[320px]">

        <ResponsiveContainer>

          <PieChart>

            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              outerRadius={120}
              label
            >

              {

                chartData.map(
                  (
                    entry,
                    index
                  ) => (

                    <Cell
                      key={index}
                      fill={
                        COLORS[index]
                      }
                    />

                  )

                )

              }

            </Pie>

            <Tooltip />

          </PieChart>

        </ResponsiveContainer>

      </div>

    </div>

  );

}