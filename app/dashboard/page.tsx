export const dynamic = "force-dynamic";

import Sidebar from "@/components/Sidebar";
import DashboardChart from "@/components/DashboardChart";
import LogoutButton from "@/components/LogoutButton";
import RealtimeLeads from "@/components/RealtimeLeads";
import NotificationBell from "@/components/NotificationBell";
import ActivityFeed from "@/components/ActivityFeed";
import AgendaWidget from "@/components/AgendaWidget";
import AnimatedCard from "@/components/AnimatedCard";
import ThemeToggle from "@/components/ThemeToggle";
import AnimatedCounter from "@/components/AnimatedCounter";
import AIAssistantCard from "@/components/AIAssistantCard";

import { createClient }
from "@/lib/supabase-server";

import {
  supabaseAdmin,
} from "@/lib/supabase-admin";

export default async function HomePage() {

  const supabase =
    await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {

    return null;

  }

  const { data: leads } =
    await supabaseAdmin

      .from("leads")

      .select("*");

  const nuevos =
    leads?.filter(
      (lead) =>
        lead.status === "Nuevo"
    ).length || 0;

  const contactados =
    leads?.filter(
      (lead) =>
        lead.status === "Contactado"
    ).length || 0;

  const cerrados =
    leads?.filter(
      (lead) =>
        lead.status === "Cerrado"
    ).length || 0;

  const hotLeads =
    leads?.filter(
      (lead) =>
        lead.ai_temperature === "HOT"
    ).length || 0;

  const warmLeads =
    leads?.filter(
      (lead) =>
        lead.ai_temperature === "WARM"
    ).length || 0;

  const conversionRate =
    leads?.length
      ? Math.round(
          (
            cerrados /
            leads.length
          ) * 100
        )
      : 0;

  const estimatedRevenue =
    cerrados * 2500;

  const analyticsData = [
    {
      name: "Nuevo",
      total: nuevos,
    },
    {
      name: "Contactado",
      total: contactados,
    },
    {
      name: "Cerrado",
      total: cerrados,
    },
  ];

  return (

    <main className="min-h-screen bg-white dark:bg-[#09090B] text-black dark:text-white flex transition-colors duration-300">

      <Sidebar />

      <section className="flex-1 p-4 md:p-8 overflow-x-hidden">

        <RealtimeLeads />

        <div className="mb-10 mt-16 lg:mt-0 flex items-center justify-between">

          <div>

            <p className="text-zinc-600 dark:text-zinc-500 text-sm">
              CRM AI
            </p>

            <h1 className="text-3xl md:text-5xl font-bold mt-2">
              Dashboard
            </h1>

            <div className="mt-4">
              <LogoutButton />
            </div>

          </div>

          <div className="flex items-center gap-3">

            <ThemeToggle />

            <NotificationBell />

          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6 mb-10">

          <AnimatedCard>

            <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-7 shadow-2xl">

              <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full" />

              <p className="text-blue-100 text-sm">
                Total Leads
              </p>

              <h2 className="text-6xl font-black mt-4 text-white">

                <AnimatedCounter
                  value={leads?.length || 0}
                />

              </h2>

              <p className="text-blue-200 mt-4 text-sm">
                Leads registrados en CRM
              </p>

            </div>

          </AnimatedCard>

          <AnimatedCard>

            <div className="relative overflow-hidden bg-gradient-to-br from-green-600 to-green-800 rounded-3xl p-7 shadow-2xl">

              <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full" />

              <p className="text-green-100 text-sm">
                Contactados
              </p>

              <h2 className="text-6xl font-black mt-4 text-white">

                <AnimatedCounter
                  value={contactados}
                />

              </h2>

              <p className="text-green-200 mt-4 text-sm">
                Leads trabajados
              </p>

            </div>

          </AnimatedCard>

          <AnimatedCard>

            <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 to-purple-800 rounded-3xl p-7 shadow-2xl">

              <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full" />

              <p className="text-purple-100 text-sm">
                Cerrados
              </p>

              <h2 className="text-6xl font-black mt-4 text-white">

                <AnimatedCounter
                  value={cerrados}
                />

              </h2>

              <p className="text-purple-200 mt-4 text-sm">
                Conversión finalizada
              </p>

            </div>

          </AnimatedCard>

          <AnimatedCard>

            <div className="relative overflow-hidden bg-gradient-to-br from-orange-500 to-orange-700 rounded-3xl p-7 shadow-2xl">

              <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full" />

              <p className="text-orange-100 text-sm">
                Conversión
              </p>

              <h2 className="text-6xl font-black mt-4 text-white">
                {conversionRate}%
              </h2>

              <p className="text-orange-200 mt-4 text-sm">
                Ratio de cierre
              </p>

            </div>

          </AnimatedCard>

          <AnimatedCard>

            <div className="relative overflow-hidden bg-gradient-to-br from-pink-600 to-pink-800 rounded-3xl p-7 shadow-2xl">

              <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full" />

              <p className="text-pink-100 text-sm">
                Revenue
              </p>

              <h2 className="text-5xl font-black mt-4 text-white">
                ${estimatedRevenue}
              </h2>

              <p className="text-pink-200 mt-4 text-sm">
                Revenue estimado
              </p>

            </div>

          </AnimatedCard>

        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          <AIAssistantCard
            totalLeads={leads?.length || 0}
            hotLeads={hotLeads}
            warmLeads={warmLeads}
          />

          <div className="xl:col-span-2 bg-white dark:bg-[#111113] border border-zinc-200 dark:border-zinc-800 rounded-3xl transition-colors duration-300">

            <DashboardChart
              data={analyticsData}
            />

          </div>

          <div className="space-y-6">

            <div className="bg-white dark:bg-[#111113] border border-zinc-200 dark:border-zinc-800 rounded-3xl transition-colors duration-300">

              <ActivityFeed />

            </div>

            <div className="bg-white dark:bg-[#111113] border border-zinc-200 dark:border-zinc-800 rounded-3xl transition-colors duration-300">

              <AgendaWidget />

            </div>

          </div>

        </div>

      </section>

    </main>

  );

}