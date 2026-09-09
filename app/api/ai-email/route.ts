import { Permissions } from "@/platform/auth/permissions";
import {
  NextResponse,
} from "next/server";

import {
  createClient,
} from "@/lib/supabase-server";

import {
  supabaseAdmin,
} from "@/lib/supabase-admin";

import {
  authEngine,
} from "@/platform/auth";

export async function GET() {
  try {
    const supabase =
      await createClient();

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    
    const tenant =
      await authEngine.getTenant();

    
    await authEngine.requirePermission(Permissions.AI_EXECUTE);

    const {
      data: leads,
      error,
    } = await supabaseAdmin
      .from("leads")
      .select(`
        id,
        name,
        ai_personality,
        ai_temperature
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
      .in(
        "ai_temperature",
        ["HOT", "WARM"]
      )
      .limit(10);

    if (error) {
      console.error(
        "AI EMAIL ERROR:",
        error
      );

      return NextResponse.json(
        {
          success: false,
        },
        {
          status: 500,
        }
      );
    }

    const results: Array<{
  lead: string;
  personality: string;
  subject: string;
  email: string;
  saved: boolean;
}> = [];
    const activities: Array<{
  lead_id: number | string;
  user_id: string;
  type: string;
  description: string;
}> = [];

    for (const lead of leads || []) {
      const personality =
        lead.ai_personality ||
        "friendly";

      let subject =
        "Seguimiento comercial";

      let emailContent =
        `Hola ${lead.name}, seguimos disponibles para ayudarte.`;

      switch (personality) {
        case "premium":
          subject =
            "Atención prioritaria para tu solicitud";

          emailContent =
`Hola ${lead.name},

Seguimos preparados para ayudarte de manera personalizada.

Quedamos atentos para continuar contigo.

CRM AI Core`;
          break;

        case "urgent":
          subject =
            "Seguimiento prioritario";

          emailContent =
`Hola ${lead.name},

Seguimos atentos para avanzar contigo esta semana.

Estamos disponibles para ayudarte.

CRM AI Core`;
          break;

        case "friendly":
          subject =
            "Seguimos en contacto";

          emailContent =
`Hola ${lead.name},

Queríamos retomar la conversación contigo.

Seguimos disponibles para ayudarte cuando gustes.

CRM AI Core`;
          break;

        default:
          subject =
            "Seguimiento de propuesta";

          emailContent =
`Hola ${lead.name},

Seguimos atentos por si deseas continuar revisando opciones.

Quedamos disponibles para ayudarte.

CRM AI Core`;
      }

      activities.push({
        lead_id:
          lead.id,
        user_id:
          user.id,
        type:
          "AI EMAIL",
        description:
          subject,
      });

      results.push({
        lead:
          lead.name,
        personality,
        subject,
        email:
          emailContent,
        saved: true,
      });
    }

    if (activities.length > 0) {
      await supabaseAdmin
        .from("activities")
        .insert(
          activities
        );
    }

    return NextResponse.json({
      success: true,
      total:
        results.length,
      results,
    });
  } catch (err) {
    console.error(
      "AI EMAIL ERROR:",
      err
    );

    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}



