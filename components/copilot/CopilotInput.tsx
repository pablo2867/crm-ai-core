interface Props {
  question: string;
  setQuestion: (
    value: string
  ) => void;

  loading: boolean;

  askCopilot: () => void;
}

export default function CopilotInput({
  question,
  setQuestion,
  loading,
  askCopilot,
}: Props) {
  return (
    <div
      className="
        mt-2
        flex
        gap-4
      "
    >
      <input
        value={question}
        onChange={(e) =>
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
        onClick={askCopilot}
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
        {loading
          ? "Pensando..."
          : "Enviar"}
      </button>
    </div>
  );
}