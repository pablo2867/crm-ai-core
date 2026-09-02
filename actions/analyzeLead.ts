"use server";

export async function analyzeLead(
  lead: {
    name: string;
    company: string;
    email: string;
  }
) {

  try {

    const response =
      await fetch(

        "http://127.0.0.1:11434/api/generate",

        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({

            model:
              "qwen2.5-coder",

            prompt:
              `
Eres un CRM AI profesional.

Analiza este lead:

Nombre:
${lead.name}

Empresa:
${lead.company}

Email:
${lead.email}

Responde EXACTAMENTE así:

Temperatura: HOT/WARM/COLD
Score: 1-100
Probabilidad: Alta/Media/Baja
Prioridad: Alta/Media/Baja
Intención: Compra/Investigación/Contacto
Resumen: una sola línea corta
`,

            stream: false,

            options: {
              temperature: 0.1,
              num_predict: 120,
            },

          }),

          cache: "no-store",

        }

      );

    if (!response.ok) {

      throw new Error(
        "Ollama no respondió"
      );

    }

    const data =
      await response.json();

    return (
      data.response ||
      "Sin respuesta IA"
    );

  } catch (error) {

    console.log(error);

    return `
Temperatura: COLD
Score: 50
Probabilidad: Media
Prioridad: Media
Intención: Contacto
Resumen: Error analizando lead
`;

  }

}