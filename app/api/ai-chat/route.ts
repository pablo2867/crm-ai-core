import {
  NextResponse,
} from "next/server";

import {
  supabaseAdmin,
} from "@/lib/supabase-admin";

import {
  createClient,
} from "@/lib/supabase-server";

export async function POST(
  req: Request
) {

  try {

    console.log(
      "API AI CHAT INICIADA"
    );

    // AUTH

    const supabase =
      await createClient();

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    console.log(
      "USER LOGUEADO:",
      user
    );

    if (!user) {

      return NextResponse.json({

        text:
          "Unauthorized",

      });

    }

    // BODY

    const body =
      await req.json();

    const rawMessage =
      body.message || "";

    const message =

      rawMessage

        .toLowerCase()

        .replace(/[¿?.,]/g, "")

        .trim();

    console.log(
      "RAW MESSAGE:",
      rawMessage
    );

    console.log(
      "NORMALIZED MESSAGE:",
      message
    );

    // LEADS

    const {
      data: leads,
      error,
    } = await supabaseAdmin

      .from("leads")

      .select("*")

      .eq(
        "user_id",
        user.id
      )

      .limit(10);

    console.log(
      "SUPABASE LEADS:",
      leads
    );

    console.log(
      "SUPABASE ERROR:",
      error
    );

    // SAFE CRM CONTEXT

    const simplifiedLeads =

      leads?.map((lead) => ({

        name:
          lead.name || "",

        company:
          lead.company || "",

        status:
          lead.status || "",

        temperature:
          lead.ai_temperature || "",

        score:
          lead.ai_score || 0,

        probability:
          lead.close_probability || 0,

        revenue:
          lead.estimated_revenue || 0,

        analysis:
          lead.ai_analysis || "",

        priority:
          lead.ai_priority || "",

      })) || [];

    console.log(
      "LEADS ENVIADOS A IA:",
      simplifiedLeads
    );

    // LEAD INTELLIGENCE ENGINE

    const rankedLeads =

      [...simplifiedLeads]

        .sort(

          (a, b) => {

            const statusPenaltyA =

              a.status === "Cerrado"
                ? -100
                : 0;

            const statusPenaltyB =

              b.status === "Cerrado"
                ? -100
                : 0;

            const scoreA =

              (a.score || 0) +

              (a.probability || 0) +

              (a.revenue || 0) / 1000 +

              (a.temperature === "HOT"
                ? 50
                : a.temperature === "WARM"
                ? 20
                : 0) +

              statusPenaltyA;

            const scoreB =

              (b.score || 0) +

              (b.probability || 0) +

              (b.revenue || 0) / 1000 +

              (b.temperature === "HOT"
                ? 50
                : b.temperature === "WARM"
                ? 20
                : 0) +

              statusPenaltyB;

            return scoreB - scoreA;

          }

        );

    const bestLead =
      rankedLeads[0];

    console.log(
      "BEST LEAD:",
      bestLead
    );

    console.log(
      "BEST LEAD FINAL:",
      bestLead
    );

    // AUTO TASK ENGINE

    const autoTasks =

      rankedLeads

        .filter(

          (lead) =>

            lead.temperature === "HOT" &&

            lead.probability >= 80 &&

            lead.status !== "Cerrado"

        )

        .map((lead) => ({

          user_id:
            user.id,

          lead_name:
            lead.name,

          title:
            "Followup requerido",

          description:
            `Contactar a ${lead.name} en las próximas 24 horas.`,

          priority:
            "high",

        }));

    console.log(
      "AUTO TASKS:",
      autoTasks
    );

    // INSERT TASKS DEBUG

    if (
      autoTasks.length > 0
    ) {

      const {
        data: insertedTasks,
        error: taskError,
      } = await supabaseAdmin

        .from("tasks")

        .insert(autoTasks)

        .select();

      console.log(
        "INSERTED TASKS:",
        insertedTasks
      );

      console.log(
        "TASK INSERT ERROR:",
        taskError
      );

    }

    // DETECTAR LEAD EN MENSAJE

    const detectedLead =

      simplifiedLeads.find(

        (lead) =>

          message.includes(
            lead.name.toLowerCase()
          )

      );

    console.log(
      "DETECTED LEAD:",
      detectedLead
    );

    // DEBUG FETCH

    console.log(
      "INTENTANDO CONECTAR AI SERVER..."
    );

    // AI SERVER

    const response =
      await fetch(
        "http://127.0.0.1:4000/chat",
        {

          method: "POST",

          headers: {

            "Content-Type":
              "application/json",

          },

          body: JSON.stringify({

            message,

            leads:
              bestLead
                ? [bestLead]
                : [],

            bestLead:
              bestLead || null,

            detectedLead:
              detectedLead || null,

          }),

        }
      );

    console.log(
      "STATUS FETCH:",
      response.status
    );

    const data =
      await response.json();

    console.log(
      "AI RESPONSE:",
      data
    );

    return NextResponse.json({

      text:
        data?.text ||

        "Sin respuesta IA",

    });

  } catch (err) {

    console.log(
      "AI CHAT ERROR:",
      err
    );

    return NextResponse.json({

      text:
        "Error AI Server",

    });

  }

}