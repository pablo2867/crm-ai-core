export const revalidate = 60;

import PipelineClient from "@/components/PipelineClient";
import DashboardStats from "@/components/DashboardStats";
import CreateLeadButton from "@/components/CreateLeadButton";

import {
  createClient,
} from "@/lib/supabase-server";

import {
  tenantResolver,
} from "@/platform/tenant";

import {
  getLeads,
} from "@/platform/services/lead-service";

import type {
  Lead,
} from "@/platform/domain/lead/types";

export default async function PipelinePage() {

  const supabase =
    await createClient();

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  console.log(
    "========================================"
  );

  console.log(
    "PIPELINE AUTH USER:",
    user
  );

  console.log(
    "========================================"
  );

  if (!user) {

    console.log(
      "NO AUTHENTICATED USER"
    );

    return null;

  }

  
  const tenantResult =
    await tenantResolver.resolve({

      userId:
        user.id,

    });

  if (
    !tenantResult.success ||
    !tenantResult.tenant
  ) {
    return null;
  }

  const tenant =
    tenantResult.tenant;
let leads: Lead[] = [];

  try {

    leads =
      await getLeads(

        user.id,

        {
          organizationId:
            tenant.organizationId,

          workspaceId:
            tenant.workspaceId,

        }

      );

    console.log(
      "========================================"
    );

    console.log(
      "USER ID:",
      user.id
    );

    console.log(
      "TOTAL LEADS:",
      leads.length
    );

    console.log(
      "LEADS:",
      leads
    );

    console.log(
      "========================================"
    );

  } catch (error) {

    console.error(
      "PIPELINE PAGE ERROR:",
      error
    );

  }

  return (

    <section
      className="
        p-6
        min-h-screen
        bg-[#09090B]
      "
    >

      <div
        className="
          mb-10
          mt-16
          lg:mt-0
          flex
          items-center
          justify-between
          gap-4
        "
      >

        <div>

          <p
            className="
              text-zinc-500
              text-sm
            "
          >
            CRM AI
          </p>

          <h1
            className="
              text-4xl
              md:text-6xl
              font-black
              text-white
              mt-2
            "
          >
            Pipeline
          </h1>

        </div>

        <CreateLeadButton />

      </div>

      <DashboardStats
        leads={leads}
      />

      <PipelineClient
        leads={leads}
      />

    </section>

  );

}


