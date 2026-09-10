import { redirect } from "next/navigation";
export const revalidate = 60;

import AIAssistantCard from "@/components/AIAssistantCard";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardStats from "@/components/dashboard/DashboardStats";
import DashboardWidgets from "@/components/dashboard/DashboardWidgets";
import AICommandCenter from "@/components/dashboard/AICommandCenter";
import AIActivityTimeline from "@/components/dashboard/AIActivityTimeline";

// import DashboardAnalytics from "@/components/dashboard/DashboardAnalytics";
// import AIManagerCard from "@/components/ai/AIManagerCard";

import { createClient } from "@/lib/supabase-server";
import { getDashboardData } from "@/lib/dashboard-data";

import {
  authEngine,
} from "@/platform/auth";

export default async function HomePage() {

  const supabase =
    await createClient();

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  let tenant;

try {
    tenant = await authEngine.getTenant();
} catch (error) {
    if (
        error instanceof Error &&
        error.message === "TENANT_NOT_FOUND"
    ) {
        redirect("/onboarding");
    }

    throw error;
}

  const {
    leads,
    contactados,
    cerrados,
    hotLeads,
    warmLeads,
    conversionRate,
    estimatedRevenue,
    forecastRevenue,
  } =
    await getDashboardData(
      user.id,
      {
        organizationId: tenant.organizationId,
        workspaceId: tenant.workspaceId,
      }
    );

  return (

    <main
      className="
        min-h-screen
        bg-[#09090B]
        text-white
      "
    >

      <section
        className="
          p-4
          md:p-8
          overflow-x-hidden
        "
      >

        <DashboardHeader />

        <DashboardStats
          totalLeads={
            leads?.length || 0
          }
          contactados={
            contactados
          }
          cerrados={
            cerrados
          }
          conversionRate={
            conversionRate
          }
          estimatedRevenue={
            estimatedRevenue
          }
          forecastRevenue={
            forecastRevenue
          }
        />

        <div
          className="
            grid
            grid-cols-1
            xl:grid-cols-4
            gap-6
            items-start
          "
        >

          <div
            className="
              space-y-6
            "
          >

            <AIAssistantCard
              totalLeads={
                leads?.length || 0
              }
              hotLeads={
                hotLeads
              }
              warmLeads={
                warmLeads
              }
            />

          </div>

          <div
            className="
              xl:col-span-2
              grid
              gap-6
              content-start
            "
          >

            <AICommandCenter
              totalLeads={
                leads?.length || 0
              }
              hotLeads={
                hotLeads
              }
              estimatedRevenue={
                estimatedRevenue
              }
            />

            <AIActivityTimeline />

          </div>

          <div>

            <DashboardWidgets
              userId={user.id}
            />

          </div>

        </div>

      </section>

    </main>

  );

}





