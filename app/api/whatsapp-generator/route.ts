import { NextResponse } from "next/server";

import { aiGateway } from "@/platform/ai/gateway";
import { authEngine } from "@/platform/auth";
import { Permissions } from "@/platform/auth/permissions";

export async function POST(
  request: Request,
) {
  try {
    // =======================================
    // AUTHENTICATION
    // =======================================

    await authEngine.getUser();

    await authEngine.requirePermission(
      Permissions.AI_EXECUTE,
    );

    // =======================================
    // REQUEST
    // =======================================

    const body =
      await request.json();

    const lead =
      body?.lead;

    const type =
      body?.type ?? "followup";

    if (!lead) {
      return NextResponse.json(
        {
          success: false,
          error: "Lead requerido.",
        },
        {
          status: 400,
        },
      );
    }

    // =======================================
    // OBJECTIVE
    // =======================================

    let objective =
      "Genera un WhatsApp de seguimiento.";

    if (type === "reactivation") {
      objective =
        "Genera un WhatsApp para reactivar un lead.";
    }

    if (type === "closing") {
      objective =
        "Genera un WhatsApp para impulsar el cierre.";
    }

    // =======================================
    // LEAD CONTEXT
    // =======================================

    const leadContext = `
Nombre: ${lead.name || "No disponible"}
Empresa: ${lead.company || "No disponible"}
Email: ${lead.email || "No disponible"}
Teléfono: ${lead.phone || "No disponible"}
Estado: ${lead.status || "No disponible"}
AI Score: ${lead.ai_score ?? "No disponible"}
Temperatura: ${lead.ai_temperature || "No disponible"}
Probabilidad de cierre: ${
      lead.close_probability ?? "No disponible"
    }%
Revenue estimado: ${
      lead.estimated_revenue ?? "No disponible"
    }
`;

    // =======================================
    // AI PROMPT
    // =======================================

    const prompt = `
Eres un SDR experto.

${objective}

Información interna del lead:

${leadContext}

REGLAS:

- Escribe únicamente en español.
- Máximo 60 palabras.
- Tono humano, natural y profesional.
- Debe parecer un WhatsApp real escrito por un vendedor.
- Usa el nombre del lead de forma natural cuando esté disponible.
- Nunca coloques @ delante del nombre.
- Usa la empresa de forma natural cuando sea relevante.
- No inventes empresas, productos, proyectos ni información.
- No menciones datos que estén como "No disponible".
- AI Score, temperatura, probabilidad de cierre y revenue son información INTERNA.
- Usa esa información únicamente para orientar el mensaje y la estrategia comercial.
- NUNCA menciones al cliente el AI Score.
- NUNCA menciones al cliente la probabilidad de cierre.
- NUNCA menciones al cliente el revenue estimado.
- NUNCA menciones al cliente la temperatura del lead.
- NUNCA menciones que estás usando inteligencia artificial.
- No repitas saludos.
- No escribas "Hola" dos veces.
- No comiences con un saludo y después vuelvas a iniciar otro saludo.
- No incluyas explicaciones antes o después del mensaje.
- No uses markdown.
- Usa emojis moderadamente.
- Genera únicamente el mensaje final que será enviado por WhatsApp.
`;

    // =======================================
    // DEBUG REQUEST
    // =======================================

    console.log(
      "WHATSAPP_GENERATOR_REQUEST",
      {
        leadId:
          lead.id ?? null,

        leadName:
          lead.name ?? null,

        hasPhone:
          Boolean(lead.phone),

        type,

        provider:
          process.env.AI_PROVIDER ?? "not-defined",
      },
    );

    // =======================================
    // AI GENERATION
    // =======================================

    const response =
      await aiGateway.generate({
        prompt,
        temperature: 0.4,
        numPredict: 120,
      });

    // =======================================
    // DEBUG RESPONSE
    // =======================================

    console.log(
      "WHATSAPP_GENERATOR_RESPONSE",
      {
        success:
          response.success,

        provider:
          response.provider,

        model:
          response.model,

        hasText:
          Boolean(response.text),

        textLength:
          response.text?.length ?? 0,

        error:
          "error" in response
            ? response.error
            : undefined,
      },
    );

    // =======================================
    // AI ERROR
    // =======================================

    if (!response.success) {
      return NextResponse.json(
        {
          success: false,

          error:
            "error" in response
              ? response.error
              : "AI_GENERATION_FAILED",

          whatsapp:
            "No fue posible generar el mensaje de WhatsApp.",

          provider:
            response.provider,

          model:
            response.model,
        },
        {
          status: 500,
        },
      );
    }

    // =======================================
    // EMPTY RESPONSE
    // =======================================

    if (!response.text?.trim()) {
      console.error(
        "WHATSAPP_GENERATOR_EMPTY_RESPONSE",
        {
          provider:
            response.provider,

          model:
            response.model,
        },
      );

      return NextResponse.json(
        {
          success: false,

          error:
            "AI_EMPTY_RESPONSE",

          whatsapp:
            "No fue posible generar el mensaje de WhatsApp.",

          provider:
            response.provider,

          model:
            response.model,
        },
        {
          status: 500,
        },
      );
    }

    // =======================================
    // RESPONSE
    // =======================================

    return NextResponse.json({
      success: true,

      whatsapp:
        response.text.trim(),

      provider:
        response.provider,

      model:
        response.model,
    });

  } catch (error) {

    console.error(
      "WHATSAPP_GENERATOR_ERROR",
      {
        name:
          error instanceof Error
            ? error.name
            : "UNKNOWN_ERROR",

        message:
          error instanceof Error
            ? error.message
            : String(error),

        stack:
          error instanceof Error
            ? error.stack
            : undefined,
      },
    );

    return NextResponse.json(
      {
        success: false,

        error:
          error instanceof Error
            ? error.message
            : "Error desconocido generando WhatsApp.",

        whatsapp:
          "No fue posible generar el mensaje de WhatsApp.",
      },
      {
        status: 500,
      },
    );
  }
}



