"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LabelList,
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

interface DashboardChartProps {
  data: {
    name: string;
    total: number;
  }[];
}

export default function DashboardChart({
  data,
}: DashboardChartProps) {
  if (!data?.length) {
    return (
      <div
        className="
          bg-[#111113]
          border
          border-zinc-800
          rounded-3xl
          p-10
          text-center
        "
      >
        <h3 className="text-xl font-bold text-white">
          Sin datos
        </h3>

        <p className="text-zinc-500 mt-2">
          Aún no existen leads para generar analytics.
        </p>
      </div>
    );
  }

  const pieData = data.map(
    (item) => ({
      name: item.name,
      value: item.total,
    })
  );

  const COLORS = [
    "#3B82F6",
    "#F59E0B",
    "#8B5CF6",
    "#10B981",
    "#6366F1",
    "#EF4444",
  ];

  return (
    <div
      className="
        bg-[#111113]
        border
        border-zinc-800
        rounded-3xl
        p-6
        shadow-2xl
      "
    >
      <div className="mb-8">
        <p className="text-zinc-500 text-sm">
          CRM Analytics
        </p>

        <h2 className="text-3xl font-black text-white mt-2">
          Performance Dashboard
        </h2>

        <div className="grid grid-cols-3 gap-4 mt-8">
          {data.map((item) => (
            <div
              key={item.name}
              className="
                bg-zinc-900/50
                rounded-2xl
                p-4
              "
            >
              <p className="text-zinc-400 text-sm">
                {item.name}
              </p>

              <h3 className="text-3xl font-black text-white">
                {item.total}
              </h3>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div
          className="
            bg-zinc-900/40
            border
            border-zinc-800
            rounded-3xl
            p-5
          "
        >
          <h3 className="text-lg font-bold mb-6 text-white">
            Leads por etapa
          </h3>

          <div className="w-full h-[260px]">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart data={data}>
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

                <Bar
                  dataKey="total"
                  fill="#3B82F6"
                  radius={[8, 8, 0, 0]}
                >
                  <LabelList
                    dataKey="total"
                    position="top"
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div
          className="
            bg-zinc-900/40
            border
            border-zinc-800
            rounded-3xl
            p-5
          "
        >
          <h3 className="text-lg font-bold mb-6 text-white">
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
                >
                  {pieData.map(
                    (_, index) => (
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
          bg-zinc-900/40
          border
          border-zinc-800
          rounded-3xl
          p-5
        "
      >
        <h3 className="text-lg font-bold mb-6 text-white">
          Tendencia de conversión
        </h3>

        <div className="w-full h-[320px]">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <AreaChart data={data}>
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


               

