export const dynamic = "force-dynamic";

import Sidebar from "@/components/Sidebar";
import RealtimeLeads from "@/components/RealtimeLeads";
import AIAssistantCard from "@/components/AIAssistantCard";
import AIChat from "@/components/AIChat";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardStats from "@/components/dashboard/DashboardStats";
import DashboardAnalytics from "@/components/dashboard/DashboardAnalytics";
import DashboardWidgets from "@/components/dashboard/DashboardWidgets";

import { createClient } from "@/lib/supabase-server";
import { getDashboardData } from "@/lib/dashboard-data";

export default async function HomePage() {

  const supabase =
    await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {

    return null;

  }

  const {
    leads,
    contactados,
    cerrados,
    hotLeads,
    warmLeads,
    conversionRate,
    estimatedRevenue,
    analyticsData,
  } =
    await getDashboardData();

  return (

    <main className="min-h-screen bg-white dark:bg-[#09090B] text-black dark:text-white flex transition-colors duration-300">

      <Sidebar />

      <section className="flex-1 p-4 md:p-8 overflow-x-hidden">

        <RealtimeLeads />

        <AIChat />

        <DashboardHeader />

        <DashboardStats
          totalLeads={leads?.length || 0}
          contactados={contactados}
          cerrados={cerrados}
          conversionRate={conversionRate}
          estimatedRevenue={estimatedRevenue}
        />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          <AIAssistantCard
            totalLeads={leads?.length || 0}
            hotLeads={hotLeads}
            warmLeads={warmLeads}
          />

          <DashboardAnalytics
            data={analyticsData}
          />

          <DashboardWidgets />

        </div>

      </section>

    </main>

  );

}