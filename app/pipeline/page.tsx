export const dynamic = "force-dynamic";

import {
  cookies,
} from "next/headers";

import {
  createServerClient,
} from "@supabase/ssr";

import PipelineClient
from "@/components/PipelineClient";

import DashboardStats
from "@/components/DashboardStats";

import CreateLeadButton
from "@/components/CreateLeadButton";

export default async function PipelinePage() {

  const cookieStore =
    await cookies();

  const supabase =
    createServerClient(

      process.env
        .NEXT_PUBLIC_SUPABASE_URL!,

      process.env
        .NEXT_PUBLIC_SUPABASE_ANON_KEY!,

      {
        cookies: {

          get(name: string) {

            return cookieStore.get(
              name
            )?.value;

          },

        },

      }

    );

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  if (!user) {

    return null;

  }

  const result =
    await supabase

      .from("leads")

      .select(`

        *,

        lead_notes (
          id,
          note,
          created_at
        ),

        activities (
          id,
          type,
          description,
          created_at
        ),

        reminders (
          id,
          title,
          remind_at,
          completed
        )

      `)

      .eq(
        "user_id",
        user.id
      )

      .order(
        "created_at",
        {
          ascending: false,
        }
      );

  const leads =
    result.data || [];

  return (

    <section className="p-6 min-h-screen bg-[#F5F7FB] dark:bg-[#09090B]">

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

          <p className="text-zinc-500 text-sm">
            CRM AI
          </p>

          <h1
            className="
              text-4xl md:text-6xl
              font-black
              text-black dark:text-white
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

      <div
        key={JSON.stringify(
          leads?.map(
            (lead: any) =>
              lead.id
          )
        )}
      >

        <PipelineClient
          leads={leads}
        />

      </div>

    </section>

  );

}