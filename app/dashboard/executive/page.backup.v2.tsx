export const dynamic =
  "force-dynamic";

import {
  supabaseAdmin,
} from "@/lib/supabase-admin";

export default async function ExecutiveDashboard() {

  // LEADS

  const {
    data: leads,
  } = await supabaseAdmin

    .from("leads")

    .select("*");

  // KPIs

  const totalLeads =
    leads?.length || 0;

  const hotLeads =

    leads?.filter(
      (lead) =>

        lead.ai_temperature ===
        "HOT"
    ).length || 0;

  const totalRevenue =

    leads?.reduce(
      (
        acc,
        lead
      ) =>

        acc +

        (
          lead.estimated_revenue ||
          0
        ),

      0
    ) || 0;

  const avgCloseProbability =

    leads?.length

      ? Math.round(

          leads.reduce(
            (
              acc,
              lead
            ) =>

              acc +

              (
                lead.close_probability ||
                0
              ),

            0
          ) /

          leads.length
        )

      : 0;

  // TOP LEADS

  const topLeads =

    leads

      ?.sort(
        (
          a,
          b
        ) =>

          (
            b.close_probability ||
            0
          ) -

          (
            a.close_probability ||
            0
          )
      )

      ?.slice(0, 5) || [];

  return (

    <main
      className="
        min-h-screen

        bg-[#09090B]

        text-white

        p-6
        md:p-10
      "
    >

      {/* HEADER */}

      <div className="mb-10">

        <p
          className="
            text-zinc-500
            text-sm
          "
        >
          CRM AI CORE
        </p>

        <h1
          className="
            text-4xl
            md:text-6xl

            font-black

            mt-2
          "
        >
          Executive Dashboard
        </h1>

      </div>

      {/* KPI CARDS */}

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-4

          gap-6
        "
      >

        {/* TOTAL LEADS */}

        <div
          className="
            bg-[#111113]

            border
            border-zinc-800

            rounded-3xl

            p-6
          "
        >

          <p className="text-zinc-400">
            Total Leads
          </p>

          <h2
            className="
              text-5xl
              font-black

              mt-4
            "
          >
            {totalLeads}
          </h2>

        </div>

        {/* HOT LEADS */}

        <div
          className="
            bg-red-500/10

            border
            border-red-500/20

            rounded-3xl

            p-6
          "
        >

          <p className="text-red-400">
            HOT Leads
          </p>

          <h2
            className="
              text-5xl
              font-black

              mt-4
            "
          >
            {hotLeads}
          </h2>

        </div>

        {/* REVENUE */}

        <div
          className="
            bg-emerald-500/10

            border
            border-emerald-500/20

            rounded-3xl

            p-6
          "
        >

          <p className="text-emerald-400">
            Forecast Revenue
          </p>

          <h2
            className="
              text-4xl
              font-black

              mt-4
            "
          >
            $
            {totalRevenue.toLocaleString()}
          </h2>

        </div>

        {/* CLOSE PROBABILITY */}

        <div
          className="
            bg-blue-500/10

            border
            border-blue-500/20

            rounded-3xl

            p-6
          "
        >

          <p className="text-blue-400">
            Avg Close %
          </p>

          <h2
            className="
              text-5xl
              font-black

              mt-4
            "
          >
            {avgCloseProbability}%
          </h2>

        </div>

      </div>

      {/* TOP LEADS */}

      <div
        className="
          mt-10

          bg-[#111113]

          border
          border-zinc-800

          rounded-3xl

          p-6
        "
      >

        <div className="mb-8">

          <p
            className="
              text-zinc-500
              text-sm
            "
          >
            AI Revenue Intelligence
          </p>

          <h2
            className="
              text-3xl
              font-black

              mt-2
            "
          >
            Top Leads
          </h2>

        </div>

        <div className="space-y-4">

          {

            topLeads.map(
              (lead) => (

                <div
                  key={lead.id}
                  className="
                    bg-[#18181B]

                    border
                    border-zinc-800

                    rounded-2xl

                    p-5

                    flex
                    items-center
                    justify-between
                  "
                >

                  <div>

                    <h3
                      className="
                        font-bold
                        text-lg
                      "
                    >
                      {lead.name}
                    </h3>

                    <p
                      className="
                        text-zinc-500
                        text-sm

                        mt-1
                      "
                    >
                      {lead.company}
                    </p>

                  </div>

                  <div
                    className="
                      text-right
                    "
                  >

                    <p
                      className="
                        text-emerald-400
                        font-bold
                      "
                    >
                      $
                      {(
                        lead.estimated_revenue ||
                        0
                      ).toLocaleString()}
                    </p>

                    <p
                      className="
                        text-zinc-400
                        text-sm
                      "
                    >
                      {
                        lead.close_probability ||
                        0
                      }
                      % close
                    </p>

                  </div>

                </div>

              )
            )

          }

        </div>

      </div>

    </main>

  );

}