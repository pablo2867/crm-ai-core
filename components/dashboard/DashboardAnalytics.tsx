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

    <div className="xl:col-span-2 bg-white dark:bg-[#111113] border border-zinc-200 dark:border-zinc-800 rounded-3xl transition-colors duration-300">

      <DashboardChart
        data={data}
      />

    </div>

  );

}