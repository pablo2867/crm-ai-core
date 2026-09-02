import {
  aiGateway,
} from "@/platform/ai/gateway";

export interface GenerateEmailRequest {

  lead?: string;

  type?: "followup" | "reactivation" | "closing";

  subject?: string;

  objective?: string;

  audience?: string;

  company?: string;

}

export async function generateEmail(

  request: GenerateEmailRequest

): Promise<string> {

  const lead =
    request.lead ?? "Cliente";

  let objective =
    request.objective ?? "";

  if (!objective) {

    switch (request.type) {

      case "followup":

        objective = `
Retomar una conversación previa con el lead e invitarlo a una llamada breve.
`;

        break;

      case "reactivation":

        objective = `
Reactivar el interés de un lead que lleva tiempo sin responder.
`;

        break;

      default:

        objective = `
Invitar al lead a avanzar hacia una decisión final y revisar próximos pasos.
`;

    }

  }

  const prompt = `
Eres un Director Comercial experto.

${objective}

INFORMACIÓN DISPONIBLE:

Lead: ${lead}

Empresa: ${request.company ?? "No especificada"}

Audiencia: ${request.audience ?? "No especificada"}

REGLAS OBLIGATORIAS:

- Escribe únicamente información basada en los datos disponibles.
- NO inventes empresas.
- NO inventes productos.
- NO inventes proyectos.
- NO inventes suscripciones.
- NO inventes nombres de compañías.
- NO uses Alibaba Cloud.
- NO uses placeholders.
- Español profesional.
- Máximo 150 palabras.
- Incluye asunto.
- Incluye saludo.
- Incluye cierre.
- Firma como "Equipo Comercial CRM AI CORE".
- No uses markdown.
- No expliques lo que estás haciendo.
- Genera únicamente el email.

FORMATO ESPERADO:

Asunto: ...

Hola ${lead},

...

Saludos,

Equipo Comercial CRM AI CORE
`;

  const response =
    await aiGateway.generate({

      prompt,

      temperature: 0.3,

      numPredict: 220,

    });

  if (!response.success) {

    throw new Error(
      "No fue posible generar el email."
    );

  }

  return response.text;

}