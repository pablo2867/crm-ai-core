export const dynamic = "force-dynamic";

import {
  supabaseAdmin,
} from "@/lib/supabase-admin";

import { createClient }
from "@/lib/supabase-server";

import LeadCard
from "@/components/LeadCard";

import CreateLeadForm
from "@/components/CreateLeadForm";

import { Search }
from "lucide-react";

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
  }>;
}) {

  const params =
    await searchParams;

  const search =
    params.search || "";

  const supabase =
    await createClient();

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  if (!user) {

    return null;

  }

  const { data: leads } =
    await supabaseAdmin

      .from("leads")

      .select(`
        *,
        lead_notes (
          id,
          note,
          created_at
        )
      `)

      .ilike(
        "name",
        `%${search}%`
      )

      .order(
        "created_at",
        {
          ascending: false,
        }
      );

  return (

    <section className="p-4 md:p-8 min-h-screen bg-[#F5F7FB] dark:bg-[#09090B] transition-colors duration-300">

      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8 mb-10 mt-16 lg:mt-0">

        <div>

          <p className="text-zinc-500 text-sm">
            CRM AI
          </p>

          <h1 className="text-4xl md:text-6xl font-black text-black dark:text-white mt-2">
            Leads
          </h1>

          <form className="mt-6 relative w-full md:w-96">

            <Search
              size={18}
              className="
                absolute
                left-4 top-1/2
                -translate-y-1/2
                text-zinc-500
              "
            />

            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Buscar lead..."
              className="
                w-full
                pl-11 pr-4 py-4
                rounded-2xl
                bg-white dark:bg-[#111113]
                border border-zinc-200 dark:border-zinc-800
                text-black dark:text-white
                outline-none
                focus:ring-2
                focus:ring-blue-500
              "
            />

          </form>

        </div>

        <CreateLeadForm />

      </div>

      {

        leads &&
        leads.length > 0 ? (

          <div
            className="
              grid
              grid-cols-1
              xl:grid-cols-2
              gap-6
            "
          >

            {

              leads.map((lead) => (

                <LeadCard
                  key={lead.id}
                  lead={lead}
                />

              ))

            }

          </div>

        ) : (

          <div
            className="
              bg-white dark:bg-[#111113]
              border border-zinc-200 dark:border-zinc-800
              rounded-3xl
              p-20
              flex flex-col items-center justify-center
            "
          >

            <div className="text-7xl mb-6">
              📭
            </div>

            <h2
              className="
                text-3xl
                font-black
                text-black dark:text-white
              "
            >
              No hay leads todavía
            </h2>

            <p className="text-zinc-500 mt-4">
              Agrega tu primer lead para comenzar.
            </p>

          </div>

        )

      }

    </section>

  );

}