"use client";

import {
  deleteLead,
} from "@/actions/deleteLead";

import {
  updateLeadStatus,
} from "@/actions/updateLeadStatus";

import LeadNotes
from "@/components/LeadNotes";

import LeadNotesList
from "@/components/LeadNotesList";

export default function LeadRow({
  lead,
}: any) {

  const aiScore =
    lead.ai_score || 0;

  const aiAnalysis =
    lead.ai_analysis ||
    "Sin análisis IA";

  const aiTemperature =
    lead.ai_temperature ||
    "COLD";

  return (

    <tr
      className="
        border-b border-zinc-200 dark:border-zinc-900
        hover:bg-zinc-100 dark:hover:bg-zinc-900
        transition
        align-top
      "
    >

      <td className="py-5">

        <div className="flex items-center gap-3">

          <div
            className={`
              w-11 h-11 rounded-full
              flex items-center justify-center
              font-bold text-white

              ${
                lead.id % 5 === 0
                  ? "bg-blue-600"
                  : lead.id % 5 === 1
                  ? "bg-green-600"
                  : lead.id % 5 === 2
                  ? "bg-purple-600"
                  : lead.id % 5 === 3
                  ? "bg-orange-600"
                  : "bg-pink-600"
              }
            `}
          >

            {lead.name?.charAt(0)}

          </div>

          <div>

            <p className="text-black dark:text-white font-semibold">
              {lead.name}
            </p>

            <p className="text-zinc-500 text-sm">
              Cliente CRM
            </p>

          </div>

        </div>

      </td>

      <td className="text-black dark:text-white">
        {lead.company}
      </td>

      <td className="text-black dark:text-white">
        {lead.email}
      </td>

      <td>

        <div className="flex flex-col gap-3">

          <span
            className={`
              px-3 py-2 rounded-full
              text-xs font-semibold
              w-fit

              ${
                lead.status === "Nuevo"
                  ? "bg-yellow-500/20 text-yellow-500"
                  : lead.status === "Contactado"
                  ? "bg-green-500/20 text-green-500"
                  : "bg-blue-500/20 text-blue-500"
              }
            `}
          >

            {lead.status}

          </span>

          <form
            action={updateLeadStatus}
            className="flex flex-col gap-2"
          >

            <input
              type="hidden"
              name="id"
              value={lead.id}
            />

            <select
              name="status"
              defaultValue={lead.status}
              className="
                bg-white dark:bg-[#111113]
                border border-zinc-200 dark:border-zinc-700
                rounded-lg
                px-3 py-2
                text-black dark:text-white
              "
            >

              <option>
                Nuevo
              </option>

              <option>
                Contactado
              </option>

              <option>
                Cerrado
              </option>

            </select>

            <button
              type="submit"
              className="
                bg-yellow-600
                hover:bg-yellow-700
                transition
                px-3 py-2
                rounded-lg
                text-white text-sm
              "
            >
              Actualizar
            </button>

          </form>

        </div>

      </td>

      <td>

        <div className="flex flex-col gap-3">

          <div className="flex items-center gap-2">

            <span className="text-red-500">
              🔥
            </span>

            <span className="text-black dark:text-white font-bold text-lg">
              {aiScore}
            </span>

          </div>

          <span
            className={`
              px-3 py-1
              rounded-full
              text-xs
              font-bold
              w-fit

              ${
                aiTemperature === "HOT"
                  ? "bg-red-500/20 text-red-500"
                  : aiTemperature === "WARM"
                  ? "bg-yellow-500/20 text-yellow-500"
                  : "bg-blue-500/20 text-blue-500"
              }
            `}
          >

            {aiTemperature}

          </span>

          <button
            type="button"

            onClick={async () => {

              try {

                const response =
                  await fetch(

                    "/api/analyze-lead",

                    {
                      method: "POST",

                      headers: {
                        "Content-Type":
                          "application/json",
                      },

                      body: JSON.stringify({

                        id:
                          Number(lead.id),

                        name:
                          lead.name,

                        company:
                          lead.company,

                        email:
                          lead.email,

                      }),

                    }

                  );

                const data =
                  await response.json();

                console.log(
                  data.result
                );

                window.location.reload();

              } catch (error) {

                console.log(error);

              }

            }}

            className="
              bg-purple-600
              hover:bg-purple-700
              transition
              px-3 py-2
              rounded-xl
              text-white
              text-sm
              font-medium
            "
          >

            Analizar IA

          </button>

          <button
            type="button"

            onClick={async () => {

              try {

                const response =
                  await fetch(

                    "/api/generate-followup",

                    {
                      method: "POST",

                      headers: {
                        "Content-Type":
                          "application/json",
                      },

                      body: JSON.stringify({

                        id:
                          lead.id,

                        name:
                          lead.name,

                        company:
                          lead.company,

                        status:
                          lead.status,

                        ai_score:
                          lead.ai_score,

                        ai_temperature:
                          lead.ai_temperature,

                      }),

                    }

                  );

                const data =
                  await response.json();

                console.log(
                  data.message
                );

                window.location.reload();

              } catch (error) {

                console.log(error);

              }

            }}

            className="
              bg-blue-600
              hover:bg-blue-700
              transition
              px-3 py-2
              rounded-xl
              text-white
              text-sm
              font-medium
            "
          >

            Follow-up IA

          </button>

        </div>

      </td>

      <td className="text-zinc-500 text-sm pl-6">

        <div className="space-y-3">

          <p>
            {aiAnalysis}
          </p>

          {
            lead.ai_followup && (

              <div
                className="
                  bg-blue-500/10
                  border border-blue-500/20
                  rounded-2xl
                  p-3
                  text-blue-700 dark:text-blue-300
                  text-xs
                  leading-relaxed
                "
              >

                <p className="font-bold mb-1">
                  Follow-up IA
                </p>

                <p>
                  {lead.ai_followup}
                </p>

              </div>

            )
          }

          <LeadNotes
            leadId={lead.id}
          />

          <LeadNotesList
            notes={
              lead.lead_notes || []
            }
          />

        </div>

      </td>

      <td>

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
              px-3 py-2
              rounded-lg
              text-white text-sm
            "
          >
            Eliminar
          </button>

        </form>

      </td>

    </tr>

  );

}