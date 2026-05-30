const express =
  require("express");

const cors =
  require("cors");

const app =
  express();

app.use(cors());

app.use(
  express.json({
    limit: "10mb",
  })
);

app.get(
  "/",
  (req, res) => {

    res.json({

      success: true,

      message:
        "AI SERVER RUNNING",

    });

  }
);

// AI CHAT

app.post(
  "/chat",
  async (req, res) => {

    try {

      const {
        message,
        leads,
        bestLead,
        detectedLead,
      } = req.body;

      // DEBUG REQUEST

      console.log(
        "REQUEST RECIBIDO"
      );

      console.log(
        "MESSAGE:",
        message
      );

      console.log(
        "BEST LEAD:",
        bestLead
      );

      console.log(
        "DETECTED LEAD:",
        detectedLead
      );

      // SYSTEM PROMPT

      const systemPrompt = `

Eres el AI Copilot interno de un CRM SaaS.

Tu trabajo es:

- analizar leads
- priorizar oportunidades
- recomendar acciones
- generar followups comerciales

Si el usuario pregunta:
- mejor lead
- lead más caliente
- mayor probabilidad
- qué lead priorizar

usa BEST LEAD para responder.

NO respondas:
"BEST LEAD"

NO uses placeholders.

Responde de forma humana y profesional.

Si detectedLead existe:
usa su nombre y empresa.

NO inventes leads.

NO inventes datos.

NO pidas más información.

`;

      // PROMPT FINAL

      const finalPrompt = `

${systemPrompt}

BEST LEAD:

${JSON.stringify(bestLead, null, 2)}

DETECTED LEAD:

${JSON.stringify(detectedLead, null, 2)}

USER MESSAGE:

${message}

`;

      // TIMEOUT CONTROL

      const controller =
        new AbortController();

      const timeout =
        setTimeout(
          () => controller.abort(),
          180000
        );

      // FETCH OLLAMA

      const response =
        await fetch(

          "http://127.0.0.1:11434/api/generate",

          {

            method: "POST",

            signal:
              controller.signal,

            headers: {

              "Content-Type":
                "application/json",

            },

            body: JSON.stringify({

              model:
                "qwen2.5:3b",

              stream: false,

              prompt:
                finalPrompt,

              options: {

                num_predict: 80,

                temperature: 0.5,

              },

            }),

          }
        );

      clearTimeout(
        timeout
      );

      const data =
        await response.json();

      console.log(
        "OLLAMA RESPONSE:",
        data
      );

      // TEMPLATE ENGINE

      let finalText =
        data?.response ||

        "Sin respuesta";

      // NORMALIZE MESSAGE

      const normalizedMessage =

        message
          .toLowerCase()
          .replace(/[¿?.,]/g, "");

      // PRIORITY LEAD ENGINE

      const isPriorityQuestion =

        normalizedMessage.includes(
          "priorizar"
        ) ||

        normalizedMessage.includes(
          "mejor lead"
        ) ||

        normalizedMessage.includes(
          "lead más caliente"
        ) ||

        normalizedMessage.includes(
          "mayor probabilidad"
        );

      if (
        isPriorityQuestion &&
        bestLead
      ) {

        finalText = `El lead prioritario es ${bestLead.name} de la empresa ${bestLead.company}. Actualmente está ${bestLead.status}, tiene temperatura ${bestLead.temperature} y una probabilidad de cierre del ${bestLead.probability}%.`;

      }

      // FOLLOWUP ENGINE

      const isFollowup =

        normalizedMessage.includes(
          "followup"
        );

      if (
        isFollowup &&
        detectedLead
      ) {

        finalText = `Hola ${detectedLead.name},

Gracias nuevamente por el interés en nuestros servicios.

Creo que podemos ayudar a ${detectedLead.company} a avanzar rápidamente y me gustaría mostrarte algunas ideas concretas.

¿Tendrías 15 minutos esta semana para una breve llamada?

Saludos.`;

      }

      return res.json({

        success: true,

        text:
          finalText,

      });

    } catch (error) {

      console.log(
        "AI SERVER ERROR:",
        error
      );

      return res.status(500)
        .json({

          success: false,

          text:
            "Error AI Server",

        });

    }

  }
);

const PORT = 4000;

app.listen(
  PORT,
  () => {

    console.log(
      `🔥 AI SERVER RUNNING ON ${PORT}`
    );

  }
);