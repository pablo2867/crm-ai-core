import { Permissions } from "@/platform/auth/permissions";
import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  supabaseAdmin,
} from "@/lib/supabase-admin";

import {
  authEngine,
} from "@/platform/auth";

import {
  copilotController,
} from "@/platform/copilot";

import {
  aiGateway,
} from "@/platform/ai/gateway";

import {
  aiContextBuilder,
} from "@/platform/ai/context";

export async function POST(
  req: NextRequest
) {
  try {
    // =======================================
    // AUTH + TENANT
    // =======================================

    const user =
      await authEngine.getUser();

    const tenant =
      await authEngine.getTenant();

    await authEngine.requirePermission(Permissions.AI_EXECUTE);

    // =======================================
    // REQUEST
    // =======================================

    const body =
      await req.json();

    const question =
      body.question || "";

    // =======================================
    // AI CORE
    // =======================================

    const copilotResult =
      await copilotController.handle(
        question,
        {
          ...body,

          userId:
            user.id,

          organizationId:
            tenant.organizationId,

          workspaceId:
            tenant.workspaceId,
        }
      );

    if (
      copilotResult.handled
    ) {
      return NextResponse.json({
        success:
          true,

        source:
          "skill",

        ...copilotResult.result,
      });
    }

    // =======================================
    // AI CONTEXT
    // =======================================

    const aiContext =
      await aiContextBuilder.build(
        user.id,
        tenant.organizationId,
        tenant.workspaceId
      );

    // =======================================
    // CONTEXT FOR AI
    // =======================================

    const context =
      aiContext.leads
        .map(
          lead => `
${lead.name}
Score:${lead.score}
Prob:${lead.probability}
Revenue:${lead.revenue}
Temperature:${lead.temperature}
`
        )
        .join("\n");

    // =======================================
    // AI PROMPT
    // =======================================

    const prompt = `
Eres CRM AI Copilot.

Debes responder únicamente usando
la información disponible.

Revenue total:
${aiContext.totalRevenue}

Mejor Lead:
${aiContext.bestLead?.name ?? "N/A"}

Hot Leads:
${aiContext.hotLeads}

LEADS

${context}

PREGUNTA

${question}

REGLAS

- Español.
- Máximo 4 líneas.
- No inventes datos.
- Si falta información, indícalo.
`;

    const response =
      await aiGateway.generate({
        prompt,

        temperature:
          0,

        numPredict:
          50,
      });

    // =======================================
    // ACTIVITY LOG
    // =======================================

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
            "AI COPILOT",

          description:
            `Pregunta: ${question}`,
        },
      ]);

    // =======================================
    // RESPONSE
    // =======================================

    return NextResponse.json({
      success:
        response.success,

      source:
        response.provider,

      provider:
        response.provider,

      model:
        response.model,

      answer:
        response.text,

      totalLeads:
        aiContext.leads.length,

      totalRevenue:
        aiContext.totalRevenue,

      hotLeads:
        aiContext.hotLeads,

      bestLead:
        aiContext.bestLead?.name ?? null,
    });

  } catch (error) {
    console.error(
      "AI COPILOT ERROR:",
      error
    );

    return NextResponse.json(
      {
        success:
          false,

        answer:
          "Error generando respuesta con IA.",
      },
      {
        status: 500,
      }
    );
  }
}



