"use client";

import {
  useState,
} from "react";

import {
  deleteLead,
} from "@/actions/deleteLead";

import LeadDetailsModal
from "@/components/LeadDetailsModal";

import EditLeadModal
from "@/components/EditLeadModal";

export default function LeadCard({
  lead,
}: any) {

  const [
    open,
    setOpen,
  ] = useState(false);

  const [
    editOpen,
    setEditOpen,
  ] = useState(false);

  return (

    <>

      <div

        className="
          group
          relative

          bg-white dark:bg-[#111113]

          border border-zinc-200 dark:border-zinc-800

          rounded-3xl

          p-4

          space-y-4

          shadow-sm

          hover:shadow-2xl
          hover:-translate-y-1
          hover:border-blue-500/30

          transition-all
          duration-300
        "
      >

        <div className="flex items-start justify-between gap-3">

          <div className="flex items-center gap-3">

            <div
              className="
                w-11 h-11 rounded-full

                bg-gradient-to-br
                from-blue-600
                to-purple-600

                text-white

                flex items-center justify-center

                text-lg font-bold
              "
            >

              {lead.name?.charAt(0)}

            </div>

            <div>

              <h2
                className="
                  text-base
                  font-bold
                  text-black dark:text-white
                "
              >
                {lead.name}
              </h2>

              <p className="text-zinc-500 text-sm">
                {lead.company}
              </p>

              <p className="text-zinc-400 text-xs">
                {lead.email}
              </p>

              {

                lead.phone && (

                  <p className="text-zinc-400 text-xs mt-1">
                    📞 {lead.phone}
                  </p>

                )

              }

            </div>

          </div>

          <form
            action={deleteLead}

            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <input
              type="hidden"
              name="id"
              value={lead.id}
            />

            <button
              type="submit"

              className="
                bg-red-600
                hover:bg-red-700

                transition

                text-white

                px-3 py-1.5

                rounded-xl

                text-xs
              "
            >
              Eliminar
            </button>

          </form>

        </div>

        <div className="flex flex-wrap gap-2">

          <span
            className="
              px-3 py-1

              rounded-full

              bg-yellow-500/20
              text-yellow-600

              text-xs
              font-semibold
            "
          >
            {lead.status}
          </span>

          <span
            className={`
              px-3 py-1

              rounded-full

              text-xs
              font-semibold

              ${
                lead.ai_score >= 90
                  ? "bg-red-500/20 text-red-500"

                  : lead.ai_score >= 70
                  ? "bg-yellow-500/20 text-yellow-600"

                  : "bg-blue-500/20 text-blue-500"
              }
            `}
          >

            {

              lead.ai_score >= 90
                ? "🔥"

                : lead.ai_score >= 70
                ? "⚡"

                : "❄️"

            }

            {" "}

            {lead.ai_score}

          </span>

          <span
            className={`
              px-3 py-1

              rounded-full

              text-xs
              font-semibold

              ${
                lead.ai_temperature === "HOT"
                  ? "bg-red-500/20 text-red-500"

                  : lead.ai_temperature === "WARM"
                  ? "bg-yellow-500/20 text-yellow-600"

                  : "bg-blue-500/20 text-blue-500"
              }
            `}
          >

            {

              lead.ai_temperature === "HOT"
                ? "🔥 HOT"

                : lead.ai_temperature === "WARM"
                ? "⚡ WARM"

                : "❄️ COLD"

            }

          </span>

        </div>

        <div
          className="
            bg-zinc-100 dark:bg-zinc-900

            rounded-2xl

            p-3

            min-h-[60px]

            flex items-center
          "
        >

          <p
            className="
              text-xs

              text-zinc-600 dark:text-zinc-300

              line-clamp-2
            "
          >
            {lead.ai_analysis}
          </p>

        </div>

        {

          lead.ai_followup && (

            <div
              className="
                bg-blue-500/10

                border border-blue-500/20

                rounded-2xl

                p-3
              "
            >

              <p
                className="
                  text-xs
                  font-bold

                  text-blue-600

                  mb-1
                "
              >
                Follow-up IA
              </p>

              <p
                className="
                  text-xs

                  text-blue-700 dark:text-blue-300

                  leading-relaxed

                  line-clamp-2
                "
              >
                {lead.ai_followup}
              </p>

            </div>

          )

        }

        <div className="flex items-center gap-2">

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

              px-3 py-2

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

              px-3 py-2

              rounded-xl

              text-xs
              font-semibold
            "
          >
            Editar
          </button>

          {

            lead.phone && (

              <a

                href={`https://wa.me/${lead.phone}?text=${encodeURIComponent(

                  lead.ai_temperature === "HOT"

                    ? `Hola ${lead.name},

vi tu interés y quería darte prioridad porque creo que podemos ayudarte rápidamente.

¿Tienes 10 minutos hoy para hablar?`

                    : lead.ai_temperature === "WARM"

                    ? `Hola ${lead.name},

gracias por tu interés en nuestros servicios.

Quería darte seguimiento y saber si aún estás evaluando opciones.`

                    : `Hola ${lead.name},

solo quería saludarte y compartirte que seguimos disponibles si en algún momento necesitas ayuda.`

                )}`}

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

                  px-3 py-2

                  rounded-xl

                  text-xs
                  font-semibold

                  text-center
                "
              >
                ✨ WhatsApp IA
              </a>

            )

          }

        </div>

      </div>

      {

        open && (

          <LeadDetailsModal
            key={lead.id}
            lead={lead}
            open={open}
            onClose={() =>
              setOpen(false)
            }
          />

        )

      }

      {

        editOpen && (

          <EditLeadModal
            lead={lead}
            onClose={() =>
              setEditOpen(false)
            }
          />

        )

      }

    </>

  );

}