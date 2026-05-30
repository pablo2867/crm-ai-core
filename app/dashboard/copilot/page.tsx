"use client";

import {
  useState,
} from "react";

export default function CopilotPage() {

  const [
    question,
    setQuestion,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    messages,
    setMessages,
  ] = useState<any[]>([]);

  async function askCopilot(
    customQuestion?: string
  ) {

    const finalQuestion =

      customQuestion ||
      question;

    if (!finalQuestion) return;

    setLoading(true);

    // USER MESSAGE

    const userMessage = {

      role: "user",

      content:
        finalQuestion,

    };

    setMessages(
      (prev) => [
        ...prev,
        userMessage,
      ]
    );

    try {

      const response =
        await fetch(
          "/api/ai-copilot",
          {

            method: "POST",

            headers: {

              "Content-Type":
                "application/json",

            },

            body: JSON.stringify({

              question:
                finalQuestion,

            }),

          }
        );

      const data =
        await response.json();

      // AI MESSAGE EMPTY

      const aiMessage = {

        role: "assistant",

        content: "",

      };

      setMessages(
        (prev) => [
          ...prev,
          aiMessage,
        ]
      );

      // TYPING EFFECT

      const words =
        data.answer.split(" ");

      let currentText =
        "";

      for (
        const word of words
      ) {

        currentText +=
          word + " ";

        await new Promise(
          (resolve) =>

            setTimeout(
              resolve,
              35
            )
        );

        setMessages(
          (prev) => {

            const updated =
              [...prev];

            updated[
              updated.length - 1
            ] = {

              role:
                "assistant",

              content:
                currentText,

            };

            return updated;

          }
        );

      }

    } catch (err) {

      console.log(err);

    }

    setQuestion("");

    setLoading(false);

  }

  return (

    <main
      className="
        min-h-screen

        bg-[#09090B]

        text-white

        p-6
        md:p-10
      "
    >

      {/* HEADER */}

      <div className="mb-10">

        <p
          className="
            text-zinc-500
            text-sm
          "
        >
          CRM AI CORE
        </p>

        <h1
          className="
            text-4xl
            md:text-6xl

            font-black

            mt-2
          "
        >
          AI Sales Copilot
        </h1>

      </div>

      {/* AI INSIGHTS */}

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-3

          gap-6

          mb-8
        "
      >

        {/* REVENUE */}

        <div
          className="
            bg-emerald-500/10

            border
            border-emerald-500/20

            rounded-3xl

            p-6
          "
        >

          <p
            className="
              text-emerald-400
              text-sm
            "
          >
            Revenue Insight
          </p>

          <h3
            className="
              text-2xl
              font-black

              mt-3
            "
          >
            Revenue estable
          </h3>

          <p
            className="
              text-zinc-400

              mt-2
            "
          >
            El forecast AI mantiene
            crecimiento positivo.
          </p>

        </div>

        {/* HOT LEADS */}

        <div
          className="
            bg-red-500/10

            border
            border-red-500/20

            rounded-3xl

            p-6
          "
        >

          <p
            className="
              text-red-400
              text-sm
            "
          >
            HOT Leads
          </p>

          <h3
            className="
              text-2xl
              font-black

              mt-3
            "
          >
            Leads prioritarios
          </h3>

          <p
            className="
              text-zinc-400

              mt-2
            "
          >
            Existen leads que requieren
            seguimiento inmediato.
          </p>

        </div>

        {/* PIPELINE */}

        <div
          className="
            bg-blue-500/10

            border
            border-blue-500/20

            rounded-3xl

            p-6
          "
        >

          <p
            className="
              text-blue-400
              text-sm
            "
          >
            Pipeline AI
          </p>

          <h3
            className="
              text-2xl
              font-black

              mt-3
            "
          >
            Pipeline saludable
          </h3>

          <p
            className="
              text-zinc-400

              mt-2
            "
          >
            El sistema AI detecta
            actividad positiva.
          </p>

        </div>

      </div>

      {/* CHAT */}

      <div
        className="
          bg-[#111113]

          border
          border-zinc-800

          rounded-3xl

          p-6

          h-[70vh]

          flex
          flex-col
        "
      >

        {/* MESSAGES */}

        <div
          className="
            flex-1

            overflow-y-auto

            space-y-4

            pr-2
          "
        >

          {

            messages.length === 0 && (

              <div
                className="
                  text-zinc-500

                  text-center

                  mt-20
                "
              >

                Pregunta algo sobre revenue,
                leads, forecasting o pipeline.

              </div>

            )

          }

          {

            messages.map(
              (
                message,
                index
              ) => (

                <div
                  key={index}
                  className={

                    message.role ===
                    "user"

                      ?

                      `
                        flex
                        justify-end
                      `

                      :

                      `
                        flex
                        justify-start
                      `
                  }
                >

                  <div
                    className={

                      message.role ===
                      "user"

                        ?

                        `
                          bg-blue-500

                          rounded-2xl

                          px-5
                          py-3

                          max-w-[80%]
                        `

                        :

                        `
                          bg-[#18181B]

                          border
                          border-zinc-800

                          rounded-2xl

                          px-5
                          py-3

                          max-w-[80%]
                        `
                    }
                  >

                    <p
                      className="
                        leading-relaxed
                      "
                    >
                      {
                        message.content
                      }
                    </p>

                  </div>

                </div>

              )
            )

          }

        </div>

        {/* QUICK ACTIONS */}

        <div
          className="
            flex
            flex-wrap

            gap-3

            mb-6
          "
        >

          {

            [

              "¿Qué leads tienen más probabilidad de cierre?",

              "¿Cuál es el revenue actual?",

              "¿Qué leads necesitan seguimiento urgente?",

              "¿Cómo está el pipeline actual?",

            ].map(
              (
                prompt
              ) => (

                <button
                  key={prompt}

                  onClick={() =>
                    askCopilot(
                      prompt
                    )
                  }

                  className="
                    bg-[#18181B]

                    border
                    border-zinc-800

                    hover:border-blue-500

                    hover:bg-blue-500/10

                    transition

                    rounded-2xl

                    px-4
                    py-3

                    text-sm
                  "
                >

                  {prompt}

                </button>

              )
            )

          }

        </div>

        {/* INPUT */}

        <div
          className="
            mt-2

            flex

            gap-4
          "
        >

          <input
            value={question}

            onChange={
              (e) =>

                setQuestion(
                  e.target.value
                )
            }

            placeholder="
              Pregunta algo al AI Copilot...
            "

            className="
              flex-1

              bg-[#18181B]

              border
              border-zinc-800

              rounded-2xl

              px-5
              py-4

              outline-none

              text-white
            "
          />

          <button
            onClick={() =>
              askCopilot()
            }

            disabled={loading}

            className="
              bg-blue-500

              hover:bg-blue-600

              transition

              rounded-2xl

              px-8
              py-4

              font-bold
            "
          >

            {

              loading

                ? "..."

                : "Enviar"

            }

          </button>

        </div>

      </div>

    </main>

  );

}