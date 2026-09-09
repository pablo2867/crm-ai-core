interface Props {
  askCopilot: (
    question: string
  ) => void;
}

export default function CopilotQuickActions({
  askCopilot,
}: Props) {
  const prompts = [
    "¿Qué leads tienen más probabilidad de cierre?",
    "¿Cuál es el revenue actual?",
    "¿Qué leads necesitan seguimiento urgente?",
    "¿Cómo está el pipeline actual?",
  ];

  return (
    <div
      className="
        flex
        flex-wrap
        gap-3
        mb-6
      "
    >
      {prompts.map(
        (prompt) => (
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
      )}
    </div>
  );
}
