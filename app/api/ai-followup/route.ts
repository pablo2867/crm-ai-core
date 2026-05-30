import {
  NextResponse,
} from "next/server";

import {
  generateAIResponse,
} from "@/lib/openrouter";

export async function POST(
  req: Request
) {

  try {

    const body =
      await req.json();

    const {
      name,
      company,
      email,
    } = body;

    const prompt = `

Eres un experto en ventas.

Genera un mensaje corto de seguimiento para este lead:

Nombre: ${name}

Empresa: ${company}

Email: ${email}

El mensaje debe ser profesional,
amigable y persuasivo.

`;

    const aiText =
      await generateAIResponse(
        prompt
      );

    return NextResponse.json({

      success: true,

      text: aiText,

    });

  } catch (err) {

    console.log(err);

    return NextResponse.json({

      success: false,

      text:
        "Error generando IA",

    });

  }

}