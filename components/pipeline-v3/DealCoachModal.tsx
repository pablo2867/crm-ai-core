"use client";

interface Props {
  open: boolean;
  onClose: () => void;
  coach: string;
}

export default function DealCoachModal({
  open,
  onClose,
  coach,
}: Props) {

  if (!open) {
    return null;
  }

  return (

    <div
      className="
        fixed
        inset-0
        z-50

        bg-black/70

        flex
        items-center
        justify-center

        p-4
      "
    >

      <div
        className="
          w-full
          max-w-2xl

          bg-[#111113]

          border
          border-zinc-800

          rounded-3xl

          p-8
        "
      >

        <div
          className="
            flex
            items-center
            justify-between
            mb-6
          "
        >

          <h2
            className="
              text-2xl
              font-bold
              text-white
            "
          >
            🤖 AI Deal Coach
          </h2>

          <button
            onClick={onClose}
            className="
              text-zinc-400
              hover:text-white
            "
          >
            ✕
          </button>

        </div>

        <div
          className="
            whitespace-pre-wrap
            text-zinc-300
            leading-7
          "
        >
          {coach}
        </div>

      </div>

    </div>

  );

}