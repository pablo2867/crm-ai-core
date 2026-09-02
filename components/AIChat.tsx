"use client";

import {
  useState,
} from "react";

import {
  Send,
  Sparkles,
} from "lucide-react";

import {
  toast,
} from "sonner";

export default function AIChat() {

  const [
    message,
    setMessage,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    messages,
    setMessages,
  ] = useState<any[]>([
    {
      role: "assistant",

      content:
        "Hola 👋 Soy tu CRM AI Assistant. Pregúntame sobre tus leads, pipeline o conversiones.",
    },
  ]);

  async function handleSend() {

    if (!message.trim())
      return;

    const userMessage = {

      role: "user",

      content: message,

    };

    setMessages(
      (prev) => [
        ...prev,
        userMessage,
      ]
    );

    setLoading(true);

    const currentMessage =
      message;

    setMessage("");

    try {

      const res =
        await fetch(
          "/api/ai-chat",
          {

            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({

              message:
                currentMessage,

            }),

          }
        );

      const data =
        await res.json();

      const aiResponse = {

        role: "assistant",

        content:
          data.text,

      };

      setMessages(
        (prev) => [
          ...prev,
          aiResponse,
        ]
      );

    } catch (err) {

      console.log(err);

      toast.error(
        "Error en AI Chat"
      );

    } finally {

      setLoading(false);

    }

  }

  return (

    <div
      className="
        bg-[#111113]

        border
        border-zinc-800

        rounded-3xl

        overflow-hidden

        shadow-2xl
      "
    >

      <div
        className="
          p-5

          border-b
          border-zinc-800

          flex
          items-center
          gap-3
        "
      >

        <div
          className="
            w-12 h-12

            rounded-2xl

            bg-gradient-to-br
            from-blue-500
            to-purple-600

            flex
            items-center
            justify-center

            shadow-xl
          "
        >

          <Sparkles
            className="text-white"
            size={22}
          />

        </div>

        <div>

          <h2
            className="
              text-xl
              font-black

              text-white
            "
          >
            CRM AI Assistant
          </h2>

          <p className="text-zinc-500 text-sm">
            Inteligencia CRM en tiempo real
          </p>

        </div>

      </div>

      <div
        className="
          h-[420px]

          overflow-y-auto

          p-5

          space-y-4
        "
      >

        {

          messages.map(
            (
              msg,
              index
            ) => (

              <div
                key={index}

                className={`
                  flex

                  ${
                    msg.role === "user"
                      ? "justify-end"
                      : "justify-start"
                  }
                `}
              >

                <div
                  className={`
                    max-w-[80%]

                    rounded-3xl

                    px-5 py-4

                    text-sm
                    leading-relaxed

                    shadow-lg

                    ${
                      msg.role === "user"

                        ? `
                          bg-blue-600
                          text-white
                        `

                        : `
                          bg-zinc-900
                          text-white
                        `
                    }
                  `}
                >

                  {msg.content}

                </div>

              </div>

            )
          )

        }

        {

          loading && (

            <div className="flex justify-start">

              <div
                className="
                  bg-zinc-900

                  rounded-3xl

                  px-5 py-4

                  text-sm

                  animate-pulse

                  text-white
                "
              >
                AI pensando...
              </div>

            </div>

          )

        }

      </div>

      <div
        className="
          p-5

          border-t
          border-zinc-800
        "
      >

        <div className="flex gap-3">

          <input
            value={message}

            onChange={(e) =>
              setMessage(
                e.target.value
              )
            }

            onKeyDown={(e) => {

              if (
                e.key === "Enter"
              ) {

                handleSend();

              }

            }}

            placeholder="Pregunta algo sobre tus leads..."

            className="
              flex-1

              bg-zinc-900

              border
              border-zinc-800

              rounded-2xl

              px-5 py-4

              text-sm

              text-white

              outline-none

              focus:ring-2
              focus:ring-blue-500
            "
          />

          <button
            onClick={handleSend}

            disabled={loading}

            className="
              w-14 h-14

              rounded-2xl

              bg-gradient-to-br
              from-blue-600
              to-purple-600

              text-white

              flex
              items-center
              justify-center

              shadow-xl

              hover:scale-105

              transition-all

              disabled:opacity-50
            "
          >

            <Send size={20} />

          </button>

        </div>

      </div>

    </div>

  );

}