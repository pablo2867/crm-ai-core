import DashboardChart from "@/components/DashboardChart";

interface Props {
  data: {
    name: string;
    total: number;
  }[];
}

export default function DashboardAnalytics({
  data,
}: Props) {
  return (
    <div
      className="
        xl:col-span-2
        bg-[#111113]
        border
        border-zinc-800
        rounded-3xl
        shadow-2xl
      "
    >
      <DashboardChart data={data} />
    </div>
  );
}