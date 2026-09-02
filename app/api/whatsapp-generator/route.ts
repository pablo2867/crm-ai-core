import {
  NextResponse,
} from "next/server";

import {
  aiGateway,
} from "@/platform/ai/gateway";

import {
  authEngine,
} from "@/platform/auth";

export async function POST(
  request: Request
) {
  try {
    // =======================================
    // AUTHENTICATION
    // =======================================

    await authEngine.getUser();

    // =======================================
    // REQUEST
    // =======================================

    const {
      lead,
      type,
    } = await request.json();

    if (!lead) {
      return NextResponse.json(
        {
          success: false,
          error: "Lead requerido.",
        },
        {
          status: 400,
        }
      );
    }

    let objective = "";

    if (type === "followup") {
      objective = `
Genera un WhatsApp de seguimiento.
`;
    } else if (type === "reactivation") {
      objective = `
Genera un WhatsApp para reactivar un lead.
`;
    } else {
      objective = `
Genera un WhatsApp para impulsar el cierre.
`;
    }

    const prompt = `
Eres un SDR experto.

${objective}

Lead:
${lead}

REGLAS:

- Español.
- Máximo 60 palabras.
- Tono humano.
- Tono profesional.
- No uses markdown.
- No inventes empresas.
- No inventes productos.
- No inventes proyectos.
- Usa emojis moderadamente.
- Debe parecer un WhatsApp real.

Genera únicamente el mensaje.
`;

    const response =
      await aiGateway.generate({
        prompt,
        temperature: 0.4,
        numPredict: 120,
      });

    if (!response.success) {
      return NextResponse.json({
        success: false,
        whatsapp:
          "No fue posible generar el mensaje de WhatsApp.",
        provider:
          response.provider,
        model:
          response.model,
      });
    }

    return NextResponse.json({
      success: true,
      whatsapp:
        response.text,
      provider:
        response.provider,
      model:
        response.model,
    });

  } catch (error) {
    console.error(
      "WHATSAPP ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        whatsapp:
          error instanceof Error
            ? error.message
            : "Error desconocido generando WhatsApp."
      },
      {
        status: 500,
      }
    );
  }
}


