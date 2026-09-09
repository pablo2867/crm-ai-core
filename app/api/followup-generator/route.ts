import { Permissions } from "@/platform/auth/permissions";
import {
  NextResponse,
} from "next/server";

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
  request: Request
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
    Input
    ---------------------------------------
    */

    const body =
      await request.json();

    const id =
      body.id;

    if (!id) {

      return NextResponse.json(

        {
          success:
            false,

          message:
            "Lead id is required.",
        },

        {
          status:
            400,
        }

      );

    }

    /*
    ---------------------------------------
    AI Follow-up
    ---------------------------------------
    */

    const response =
      await aiGateway.generate({

        prompt: `
Eres un SDR profesional.

Genera ÚNICAMENTE un follow-up comercial.

DATOS:

Nombre:
${body.name}

Empresa:
${body.company || "No especificada"}

Temperatura:
${body.ai_temperature || "WARM"}

Score:
${body.ai_score || 50}

REGLAS OBLIGATORIAS:

- Solo español.
- Máximo 20 palabras.
- Una sola frase.
- Sin emojis.
- Sin firmas.
- Sin despedidas.
- Sin reuniones.
- Sin llamadas.
- Sin LinkedIn.
- Sin preguntas.
- No inventes datos.
- Devuelve únicamente el mensaje.

Ejemplo válido:

Hola ${body.name}, seguimos disponibles para ayudarte cuando gustes.
`,

        temperature:
          0.3,

        numPredict:
          60,

      });

    if (!response.success) {

      return NextResponse.json({

        success:
          false,

        message:
          "No fue posible generar el follow-up.",

        provider:
          response.provider,

        model:
          response.model,

      });

    }

    /*
    ---------------------------------------
    Normalize AI result
    ---------------------------------------
    */

    let result =
      response.text

        .replace(/\n/g, " ")

        .replace(/\r/g, " ")

        .trim();

    const invalidPatterns = [

      "¿cómo estás",

      "como estas",

      "perser",

      "reunión",

      "reunion",

      "llamada",

      "zoom",

      "meet",

      "linkedin",

      "¿te puedo ayudar",

      "te puedo ayudar",

      "how are you",

      "followup",

      "email",

      "correo",

    ];

    const invalidResponse =

      result.length < 10 ||

      result.length > 120 ||

      invalidPatterns.some(

        (pattern) =>

          result
            .toLowerCase()
            .includes(pattern)

      );

    if (invalidResponse) {

      result =
        `Hola ${body.name}, seguimos disponibles para ayudarte cuando gustes.`;

    }

    /*
    ---------------------------------------
    Update Lead
    ---------------------------------------
    */

    const {
      data: updateData,
      error,
    } =
      await supabaseAdmin

        .from("leads")

        .update({

          ai_followup:
            result,

        })

        .eq(
          "id",
          Number(id)
        )

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

        .select()

        .maybeSingle();

    if (error) {

      console.error(
        "FOLLOWUP UPDATE ERROR:",
        error
      );

      return NextResponse.json(

        {
          success:
            false,

          message:
            "Error actualizando lead.",
        },

        {
          status:
            500,
        }

      );

    }

    if (!updateData) {

      return NextResponse.json(

        {
          success:
            false,

          message:
            "Lead not found.",
        },

        {
          status:
            404,
        }

      );

    }

    return NextResponse.json({

      success:
        true,

      message:
        result,

      provider:
        response.provider,

      model:
        response.model,

      updated:
        updateData,

    });

  } catch (error) {

    console.error(
      "FOLLOWUP GENERAL ERROR:",
      error
    );

    return NextResponse.json(

      {
        success:
          false,

        message:
          error instanceof Error
            ? error.message
            : "Error generando follow-up IA.",
      },

      {
        status:
          500,
      }

    );

  }

}

