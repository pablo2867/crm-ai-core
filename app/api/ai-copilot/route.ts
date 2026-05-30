import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  supabaseAdmin,
} from "@/lib/supabase-admin";

export async function POST(
  req: NextRequest
) {

  try {

    // BODY

    const body =
      await req.json();

    const question =
      body.question || "";

    // LEADS

    const {
      data: leads,
      error,
    } = await supabaseAdmin

      .from("leads")

      .select("*");

    if (error) {

      console.log(error);

      return NextResponse.json({

        success: false,

      });

    }

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

    // HOT LEADS

    const hotLeads =

      leads?.filter(
        (lead) =>

          lead.ai_temperature ===
          "HOT"
      ) || [];

    // COLD LEADS

    const coldLeads =

      leads?.filter(
        (lead) =>

          lead.ai_temperature ===
          "COLD"
      ) || [];

    // TOTAL REVENUE

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

    // RESPUESTA AI

    let answer =
      "No encontré información.";

    // TOP CLOSE PROBABILITY

    if (

      question
        .toLowerCase()
        .includes("probabilidad")

    ) {

      answer =

        `Los leads con mayor probabilidad de cierre son: ` +

        topLeads
          .map(
            (lead) =>

              `${lead.name} (${lead.close_probability}%)`
          )
          .join(", ");

    }

    // HOT LEADS

    else if (

      question
        .toLowerCase()
        .includes("urgente") ||

      question
        .toLowerCase()
        .includes("hot")

    ) {

      answer =

        `Actualmente tienes ${hotLeads.length} HOT leads que requieren seguimiento prioritario.`;

    }

    // REVENUE

    else if (

      question
        .toLowerCase()
        .includes("revenue") ||

      question
        .toLowerCase()
        .includes("ingreso")

    ) {

      answer =

        `El revenue estimado actual es de $${totalRevenue.toLocaleString()}.`;

    }

    // COLD LEADS

    else if (

      question
        .toLowerCase()
        .includes("frío") ||

      question
        .toLowerCase()
        .includes("cold")

    ) {

      answer =

        `Actualmente tienes ${coldLeads.length} leads fríos en el pipeline.`;

    }

    // DEFAULT

    else {

      answer =

        `Actualmente el CRM AI tiene ${leads?.length || 0} leads activos y ${hotLeads.length} HOT leads.`;

    }

    // SIMULAR STREAMING

    const words =
      answer.split(" ");

    let streamedAnswer =
      "";

    for (
      const word of words
    ) {

      streamedAnswer +=
        word + " ";

      await new Promise(
        (resolve) =>

          setTimeout(
            resolve,
            40
          )
      );

    }

    // ACTIVITY

    await supabaseAdmin

      .from("activities")

      .insert([

        {

          type:
            "AI COPILOT",

          description:
            `AI respondió pregunta: ${question}`,

        },

      ]);

    return NextResponse.json({

      success: true,

      question,

      answer:
        streamedAnswer,

      stats: {

        totalLeads:
          leads?.length || 0,

        hotLeads:
          hotLeads.length,

        coldLeads:
          coldLeads.length,

        revenue:
          totalRevenue,

      },

    });

  } catch (err) {

    console.log(err);

    return NextResponse.json({

      success: false,

    });

  }

}