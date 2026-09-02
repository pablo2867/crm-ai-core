import RuntimeVisualizer from "@/components/runtime/RuntimeVisualizer";

import type {
  CopilotMessage,
} from "@/types/copilot";

interface Props {

  messages: CopilotMessage[];

}

export default function CopilotMessages({

  messages,

}: Props) {

  return (

    <div
      className="
        flex-1
        overflow-y-auto
        space-y-4
        pr-2
      "
    >

      {messages.length === 0 && (

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

      )}

      {messages.map(

        (

          message,

          index

        ) => (

          <div

            key={index}

            className={

              message.role === "user"

                ? "flex justify-end"

                : "flex justify-start"

            }

          >

            <div

              className={

                message.role === "user"

                  ? `
                    bg-blue-500
                    rounded-2xl
                    px-5
                    py-3
                    max-w-[80%]
                  `

                  : `
                    bg-[#18181B]
                    border
                    border-zinc-800
                    rounded-2xl
                    px-5
                    py-4
                    max-w-[80%]
                  `

              }

            >

              <p
                className="
                  leading-relaxed
                  text-white
                  whitespace-pre-wrap
                  break-words
                "
              >

                {message.content}

              </p>

              {message.role === "assistant" && (

                <>

                  {message.decision?.workflow && (

                    <div className="mt-5 border-t border-zinc-800 pt-4">

                      <h4 className="text-xs uppercase tracking-wider text-zinc-400">

                        Workflow recomendado

                      </h4>

                      <p className="mt-1 text-sm font-semibold text-emerald-400">

                        {message.decision.workflow.name}

                      </p>

                      <p className="text-xs text-zinc-500">

                        {message.decision.workflow.id}

                      </p>

                    </div>

                  )}

                  {message.decision && (

                    <div className="mt-4">

                      <h4 className="text-xs uppercase tracking-wider text-zinc-400">

                        Confianza

                      </h4>

                      <p className="mt-1 text-sm text-white">

                        {Math.round(

                          message.decision.confidence * 100

                        )}
                        %

                      </p>

                    </div>

                  )}

                  {message.explanation && (

                    <div className="mt-4">

                      <h4 className="text-xs uppercase tracking-wider text-zinc-400">

                        Explicación

                      </h4>

                      <p className="mt-1 text-sm text-zinc-300">

                        {message.explanation.summary}

                      </p>

                    </div>

                  )}

                  {message.validation && (

                    <div className="mt-4">

                      <h4 className="text-xs uppercase tracking-wider text-zinc-400">

                        Validación

                      </h4>

                      <p

                        className={

                          message.validation.valid

                            ? "mt-1 text-sm text-green-400"

                            : "mt-1 text-sm text-red-400"

                        }

                      >

                        {message.validation.valid

                          ? "Workflow validado"

                          : "Workflow requiere atención"}

                      </p>

                    </div>

                  )}

                  {message.plan && (

                    <div className="mt-4">

                      <h4 className="text-xs uppercase tracking-wider text-zinc-400">

                        Plan generado

                      </h4>

                      <p className="mt-1 text-sm text-zinc-300">

                        Plan creado correctamente.

                      </p>

                    </div>

                  )}

                  {message.runtime && (

                    <RuntimeVisualizer
                      runtime={message.runtime}
                    />

                  )}

                </>

              )}

            </div>

          </div>

        )

      )}

    </div>

  );

}