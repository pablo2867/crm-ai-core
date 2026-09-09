import { Permissions } from "@/platform/auth/permissions";
import { NextResponse } from "next/server";

import {
  authEngine,
} from "@/platform/auth";

import {
  supabaseAdmin,
} from "@/lib/supabase-admin";

import {
  aiGateway,
} from "@/platform/ai/gateway";

export async function POST(
  req: Request
) {

  try {

    /*
    ---------------------------------------
    Auth + Tenant
    ---------------------------------------
    */

    const user =
      await authEngine.getUser();

    const tenant =
      await authEngine.getTenant();

    await authEngine.requirePermission(Permissions.AI_EXECUTE);

    /*
    ---------------------------------------
    Request
    ---------------------------------------
    */

    const body =
      await req.json();

    const rawMessage =
      typeof body.message === "string"
        ? body.message
        : "";

    const message =
      rawMessage
        .toLowerCase()
        .replace(/[¿?.,]/g, "")
        .trim();

    if (!message) {

      return NextResponse.json({

        text:
          "Escribe una pregunta para el AI Assistant.",

      });

    }

    /*
    ---------------------------------------
    Leads
    ---------------------------------------
    */

    const {
      data: leads,
    } =
      await supabaseAdmin

        .from("leads")

        .select(`
          name,
          company,
          status,
          ai_temperature,
          ai_score,
          close_probability,
          estimated_revenue,
          ai_analysis,
          ai_priority
        `)

        .eq(
          "user_id",
          user.id
        )

        .eq(
          "organization_id",
          tenant.organizationId
        )

        .eq(
          "workspace_id",
          tenant.workspaceId
        )

        .limit(10);

    const simplifiedLeads =
      leads?.map(
        lead => ({

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

        })
      ) || [];

    /*
    ---------------------------------------
    Ranking
    ---------------------------------------
    */

    const rankedLeads =
      [...simplifiedLeads]
        .sort(
          (a, b) => {

            const scoreA =
              (a.score || 0) +
              (a.probability || 0) +
              (a.revenue || 0) / 1000 +
              (
                a.temperature === "HOT"
                  ? 50
                  : a.temperature === "WARM"
                    ? 20
                    : 0
              ) +
              (
                a.status === "Cerrado"
                  ? -100
                  : 0
              );

            const scoreB =
              (b.score || 0) +
              (b.probability || 0) +
              (b.revenue || 0) / 1000 +
              (
                b.temperature === "HOT"
                  ? 50
                  : b.temperature === "WARM"
                    ? 20
                    : 0
              ) +
              (
                b.status === "Cerrado"
                  ? -100
                  : 0
              );

            return scoreB - scoreA;

          }
        );

    const bestLead =
      rankedLeads.length > 0
        ? rankedLeads[0]
        : null;

    const detectedLead =
      simplifiedLeads.find(
        lead =>
          message.includes(
            lead.name.toLowerCase()
          )
      ) || null;

    /*
    ---------------------------------------
    AI Gateway
    ---------------------------------------
    */

    const aiResponse =
      await aiGateway.generate({

        prompt: JSON.stringify({

          instruction:
            "Responde como CRM AI Assistant. Usa solamente el contexto proporcionado.",

          message:
            rawMessage,

          leads:
            rankedLeads,

          bestLead,

          detectedLead,

        }),

        temperature:
          0.1,

        numPredict:
          120,

      });

    /*
    ---------------------------------------
    AI Failure
    ---------------------------------------
    */

    if (!aiResponse.success) {

      return NextResponse.json({

        text:
          aiResponse.error ||
          "No fue posible obtener una respuesta de IA.",

      });

    }

    /*
    ---------------------------------------
    Activity Log
    ---------------------------------------
    */

    await supabaseAdmin

      .from("activities")

      .insert([

        {

          user_id:
            user.id,

          organization_id:
            tenant.organizationId,

          workspace_id:
            tenant.workspaceId,

          type:
            "AI CHAT",

          description:
            `Pregunta: ${rawMessage}`,

        },

      ]);

    /*
    ---------------------------------------
    Response
    ---------------------------------------
    */

    return NextResponse.json({

      text:
        aiResponse.text ||
        "Sin respuesta IA",

    });

  }

  catch (error) {

    console.error(
      "AI CHAT ERROR:",
      error
    );

    return NextResponse.json({

      text:
        "Error AI Server",

    });

  }

}

