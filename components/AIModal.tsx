"use client";

import {
  Copy,
  X,
} from "lucide-react";

import {
  toast,
} from "sonner";

export default function AIModal({
  open,
  onClose,
  text,
}: any) {

  if (!open) return null;

  return (

    <div
      className="
        fixed inset-0
        z-[100]

        bg-black/70
        backdrop-blur-sm

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

          bg-white
          dark:bg-[#111113]

          border
          border-zinc-800

          rounded-3xl

          shadow-2xl

          overflow-hidden
        "
      >

        <div
          className="
            flex
            items-center
            justify-between

            p-5

            border-b
            border-zinc-800
          "
        >

          <div>

            <h2
              className="
                text-2xl
                font-black
                text-black
                dark:text-white
              "
            >
              ✨ AI Follow-up
            </h2>

            <p className="text-zinc-500 text-sm mt-1">
              Mensaje generado por IA
            </p>

          </div>

          <button
            onClick={onClose}

            className="
              w-10 h-10

              rounded-xl

              bg-zinc-100
              dark:bg-zinc-900

              hover:bg-zinc-200
              dark:hover:bg-zinc-800

              transition

              flex
              items-center
              justify-center
            "
          >

            <X size={18} />

          </button>

        </div>

        <div className="p-6">

          <div
            className="
              bg-zinc-100
              dark:bg-zinc-900

              rounded-2xl

              p-5

              min-h-[220px]

              whitespace-pre-wrap

              text-sm
              leading-relaxed

              text-zinc-700
              dark:text-zinc-200
            "
          >

            {text}

          </div>

          <div className="flex gap-3 mt-6">

            <button
              onClick={() => {

                navigator.clipboard.writeText(
                  text
                );

                toast.success(
                  "Texto copiado"
                );

              }}

              className="
                flex-1

                bg-blue-600
                hover:bg-blue-700

                transition

                text-white

                px-5 py-3

                rounded-2xl

                font-semibold

                flex
                items-center
                justify-center
                gap-2
              "
            >

              <Copy size={18} />

              Copiar

            </button>

            <button
              onClick={onClose}

              className="
                flex-1

                bg-zinc-200
                dark:bg-zinc-800

                hover:bg-zinc-300
                dark:hover:bg-zinc-700

                transition

                text-black
                dark:text-white

                px-5 py-3

                rounded-2xl

                font-semibold
              "
            >

              Cerrar

            </button>

          </div>

        </div>

      </div>

    </div>

  );

}