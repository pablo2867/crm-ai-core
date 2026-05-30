"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

export default function DashboardChart({
  data,
}: {
  data: any[];
}) {

  const pieData = [
    {
      name: "Nuevo",
      value:
        data.find(
          (d) =>
            d.name === "Nuevo"
        )?.total || 0,
    },
    {
      name: "Contactado",
      value:
        data.find(
          (d) =>
            d.name === "Contactado"
        )?.total || 0,
    },
    {
      name: "Cerrado",
      value:
        data.find(
          (d) =>
            d.name === "Cerrado"
        )?.total || 0,
    },
  ];

  const COLORS = [
    "#3B82F6",
    "#F59E0B",
    "#8B5CF6",
  ];

  return (

    <div
      className="
        bg-white dark:bg-[#111113]
        border border-zinc-200 dark:border-zinc-800
        rounded-3xl
        p-6
        transition-colors duration-300
      "
    >

      <div className="mb-8">

        <p className="text-zinc-500 text-sm">
          CRM Analytics
        </p>

        <h2 className="text-3xl font-black text-black dark:text-white mt-2">
          Performance Dashboard
        </h2>

      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

        <div
          className="
            bg-zinc-50 dark:bg-zinc-900/40
            rounded-3xl
            p-5
            min-h-[360px]
          "
        >

          <h3 className="text-lg font-bold mb-6 text-black dark:text-white">
            Leads por etapa
          </h3>

          <div className="w-full h-[260px]">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <BarChart
                data={data}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  strokeOpacity={0.1}
                />

                <XAxis
                  dataKey="name"
                  stroke="#71717A"
                />

                <YAxis
                  stroke="#71717A"
                />

                <Tooltip
                  contentStyle={{
                    background:
                      "#111113",
                    border:
                      "1px solid #27272A",
                    borderRadius:
                      "16px",
                    color: "white",
                  }}
                />

                <Bar
                  dataKey="total"
                  fill="#3B82F6"
                  radius={[
                    12,
                    12,
                    0,
                    0,
                  ]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

        <div
          className="
            bg-zinc-50 dark:bg-zinc-900/40
            rounded-3xl
            p-5
            min-h-[360px]
          "
        >

          <h3 className="text-lg font-bold mb-6 text-black dark:text-white">
            Distribución Pipeline
          </h3>

          <div className="w-full h-[260px]">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <PieChart>

                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={55}
                  paddingAngle={5}
                >

                  {pieData.map(
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
                  )}

                </Pie>

                <Tooltip />

              </PieChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>

      <div
        className="
          mt-10
          bg-zinc-50 dark:bg-zinc-900/40
          rounded-3xl
          p-5
        "
      >

        <h3 className="text-lg font-bold mb-6 text-black dark:text-white">
          Tendencia de conversión
        </h3>

        <div className="w-full h-[280px]">

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <AreaChart
              data={data}
            >

              <defs>

                <linearGradient
                  id="colorGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >

                  <stop
                    offset="5%"
                    stopColor="#3B82F6"
                    stopOpacity={0.8}
                  />

                  <stop
                    offset="95%"
                    stopColor="#3B82F6"
                    stopOpacity={0}
                  />

                </linearGradient>

              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                strokeOpacity={0.1}
              />

              <XAxis
                dataKey="name"
                stroke="#71717A"
              />

              <YAxis
                stroke="#71717A"
              />

              <Tooltip
                contentStyle={{
                  background:
                    "#111113",
                  border:
                    "1px solid #27272A",
                  borderRadius:
                    "16px",
                  color: "white",
                }}
              />

              <Area
                type="monotone"
                dataKey="total"
                stroke="#3B82F6"
                fillOpacity={1}
                fill="url(#colorGradient)"
              />

            </AreaChart>

          </ResponsiveContainer>

        </div>

      </div>

    </div>

  );

}