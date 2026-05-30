import ActivityFeed from "@/components/ActivityFeed";
import AgendaWidget from "@/components/AgendaWidget";

export default function DashboardWidgets() {

  return (

    <div className="space-y-6">

      <div className="bg-white dark:bg-[#111113] border border-zinc-200 dark:border-zinc-800 rounded-3xl transition-colors duration-300">

        <ActivityFeed />

      </div>

      <div className="bg-white dark:bg-[#111113] border border-zinc-200 dark:border-zinc-800 rounded-3xl transition-colors duration-300">

        <AgendaWidget />

      </div>

    </div>

  );

}