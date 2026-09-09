import { Permissions } from "@/platform/auth/permissions";
import {
  NextResponse,
} from "next/server";

import {
  authEngine,
} from "@/platform/auth";

import {
  aiGateway,
} from "@/platform/ai/gateway";

export async function POST(
  request: Request
) {
  try {

    const user =
      await authEngine.getUser();

    const tenant =
      await authEngine.getTenant();

    await authEngine.requirePermission(Permissions.AI_EXECUTE);

    const {
      lead,
      score,
      probability,
      revenue,
    } = await request.json();

    const prompt = `
Eres un Director Comercial Senior.

Lead: ${lead}
AI Score: ${score}
Probabilidad: ${probability}%
Revenue: $${revenue}

Responde EXACTAMENTE usando este formato:

PRIORIDAD:
ACCION:
MOTIVO:
SIGUIENTE_PASO:

REGLAS:

- Español.
- Máximo 25 palabras.
- Sin markdown.
- Sin listas.
- Sin explicación adicional.
`;

    const response =
      await aiGateway.generate({
        prompt,
        temperature: 0,
        numPredict: 50,
      });

    if (!response.success) {
      return NextResponse.json({
        success: false,
        coach:
          "No fue posible generar la recomendación.",
        provider:
          response.provider,
        model:
          response.model,
      });
    }

    return NextResponse.json({
      success: true,
      coach:
        response.text,
      provider:
        response.provider,
      model:
        response.model,

    });

  } catch (error) {

    console.error(
      "DEAL COACH ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        coach:
          "Error generando recomendación.",
      },
      {
        status: 500,
      }
    );
  }
}


