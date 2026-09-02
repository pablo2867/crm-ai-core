import {
  deleteLead,
} from "@/actions/deleteLead";

import type {
  LeadCardProps,
} from "./types";

export default function LeadCardHeader({

  lead,

}: LeadCardProps) {

  const revenue =
    Number(
      lead.estimated_revenue ?? 0
    );

  return (

    <div className="flex items-start justify-between gap-3">

      <div className="flex items-center gap-3">

        <div
          className="
            w-11
            h-11
            rounded-full
            bg-gradient-to-br
            from-blue-600
            to-purple-600
            text-white
            flex
            items-center
            justify-center
            text-lg
            font-bold
          "
        >

          {lead.name.charAt(0)}

        </div>

        <div>

          <h2
            className="
              text-base
              font-bold
              text-black
              dark:text-white
            "
          >

            {lead.name}

          </h2>

          <p className="text-zinc-500 text-sm">

            {lead.company ?? "Sin empresa"}

          </p>

          <p className="text-emerald-400 text-sm font-semibold">

            💰 ${revenue.toLocaleString()}

          </p>

          <p className="text-zinc-400 text-xs">

            {lead.email ?? "Sin correo"}

          </p>

          {lead.phone && (

            <p className="text-zinc-400 text-xs mt-1">

              📞 {lead.phone}

            </p>

          )}

        </div>

      </div>

      <form action={deleteLead}>

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
            px-3
            py-1.5
            rounded-xl
            text-xs
          "
        >

          Eliminar

        </button>

      </form>

    </div>

  );

}