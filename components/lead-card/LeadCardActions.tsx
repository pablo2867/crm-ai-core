import { toast } from "sonner";

export default function LeadCardActions({
  lead,
  setOpen,
  setEditOpen,
  setAiOpen,
  setAiText,
}: any) {
  const generateAI = async (
    e: React.MouseEvent
  ) => {
    e.stopPropagation();

    try {
      const res = await fetch(
        "/api/ai-followup",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            id: lead.id,
            name: lead.name,
            company: lead.company,
            email: lead.email,
          }),
        }
      );

      const data =
        await res.json();

      setAiText(
        data.text ||
          "Sin respuesta"
      );

      setAiOpen(true);
    } catch (err) {
      console.error(err);

      toast.error(
        "Error generando IA"
      );
    }
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        className="
          flex-1
          bg-zinc-900
          hover:bg-black
          transition
          text-white
          px-3
          py-2
          rounded-xl
          text-xs
          font-semibold
        "
      >
        Ver Detalles
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setEditOpen(true);
        }}
        className="
          flex-1
          bg-blue-600
          hover:bg-blue-700
          transition
          text-white
          px-3
          py-2
          rounded-xl
          text-xs
          font-semibold
        "
      >
        Editar
      </button>

      <button
        type="button"
        onClick={generateAI}
        className="
          flex-1
          bg-purple-600
          hover:bg-purple-700
          transition
          text-white
          px-3
          py-2
          rounded-xl
          text-xs
          font-semibold
        "
      >
        ✨ IA Real
      </button>

      {lead.phone && (
        <a
          href={`https://wa.me/${lead.phone}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) =>
            e.stopPropagation()
          }
          className="
            flex-1
            bg-green-600
            hover:bg-green-700
            transition
            text-white
            px-3
            py-2
            rounded-xl
            text-xs
            font-semibold
            text-center
          "
        >
          ✨ WhatsApp IA
        </a>
      )}
    </div>
  );
}
