"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const data = [

  {
    name: "Lun",
    leads: 4,
  },

  {
    name: "Mar",
    leads: 7,
  },

  {
    name: "Mié",
    leads: 5,
  },

  {
    name: "Jue",
    leads: 9,
  },

  {
    name: "Vie",
    leads: 12,
  },

  {
    name: "Sáb",
    leads: 8,
  },

  {
    name: "Dom",
    leads: 6,
  },

];

export default function AnalyticsChart() {

  return (

    <div
      className="
        bg-[#111113]

        border
        border-zinc-800

        rounded-3xl

        p-6

        mt-10

        h-[400px]
      "
    >

      <div className="mb-6">

        <p
          className="
            text-zinc-500
            text-sm
          "
        >
          CRM AI
        </p>

        <h2
          className="
            text-2xl
            font-black

            text-white

            mt-2
          "
        >
          Leads por Semana
        </h2>

      </div>

      <ResponsiveContainer
        width="100%"
        height="100%"
      >

        <LineChart
          data={data}
        >

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#27272A"
          />

          <XAxis
            dataKey="name"
            stroke="#A1A1AA"
          />

          <YAxis
            stroke="#A1A1AA"
          />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="leads"
            stroke="#3B82F6"
            strokeWidth={4}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>

  );

}