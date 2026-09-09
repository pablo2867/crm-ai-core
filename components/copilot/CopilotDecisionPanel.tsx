import type {
  CopilotMessage,
} from "@/types/copilot";

interface Props {

  message?: CopilotMessage;

}

export default function CopilotDecisionPanel({

  message,

}: Props) {

  if (

    !message ||

    message.role !== "assistant"

  ) {

    return null;

  }

  return (

    <div
      className="
        mb-6
        rounded-3xl
        border
        border-zinc-800
        bg-[#111113]
        p-6
      "
    >

      <h2
        className="
          text-lg
          font-semibold
          mb-5
        "
      >
        AI Decision Center
      </h2>

      <div className="space-y-5">

        {message.decision && (

          <div>

            <p className="text-xs text-zinc-500 uppercase">

              Workflow

            </p>

            <p className="text-emerald-400 font-semibold">

              {message.decision.workflow.name}

            </p>

            <p className="text-xs text-zinc-500">

              {message.decision.workflow.id}

            </p>

          </div>

        )}

        {message.decision && (

          <div>

            <p className="text-xs text-zinc-500 uppercase">

              Confianza

            </p>

            <div className="mt-2 h-3 rounded-full bg-zinc-800">

              <div

                className="h-3 rounded-full bg-emerald-500"

                style={{

                  width: `${Math.round(

                    message.decision.confidence * 100

                  )}%`,

                }}

              />

            </div>

            <p className="mt-2 text-sm">

              {Math.round(

                message.decision.confidence * 100

              )}%

            </p>

          </div>

        )}

        {message.validation && (

          <div>

            <p className="text-xs text-zinc-500 uppercase">

              Estado

            </p>

            <p
              className={
                message.validation.valid
                  ? "text-green-400"
                  : "text-red-400"
              }
            >

              {message.validation.valid

                ? "Workflow Validado"

                : "Requiere Atención"}

            </p>

          </div>

        )}

        {message.explanation && (

          <div>

            <p className="text-xs text-zinc-500 uppercase">

              Explicación

            </p>

            <p className="text-sm text-zinc-300">

              {message.explanation.summary}

            </p>

          </div>

        )}

      </div>

    </div>

  );

}
