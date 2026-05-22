"use client";

import {
  X,
} from "lucide-react";

import LeadNotes
from "@/components/LeadNotes";

import LeadNotesList
from "@/components/LeadNotesList";

import LeadReminders
from "@/components/LeadReminders";

import LeadRemindersList
from "@/components/LeadRemindersList";

export default function LeadDetailsModal({
  lead,
  open,
  onClose,
}: any) {

  if (!open) {
    return null;
  }

  return (

    <div
      onClick={onClose}

      className="
        fixed
        inset-0
        z-[9999]

        bg-black/40
        backdrop-blur-sm

        flex
        justify-end
      "
    >

      <div

        onClick={(e) =>
          e.stopPropagation()
        }

        className="
          w-full
          md:w-[520px]

          h-full

          bg-white
          dark:bg-[#09090B]

          border-l
          border-zinc-200
          dark:border-zinc-800

          overflow-y-auto

          p-6
        "
      >

        <div className="flex items-center justify-between mb-8">

          <div>

            <h2
              className="
                text-3xl
                font-black
                text-black
                dark:text-white
              "
            >
              {lead.name}
            </h2>

            <p className="text-zinc-500 mt-1">
              {lead.company}
            </p>

          </div>

          <button
            onClick={onClose}

            className="
              w-10
              h-10

              rounded-xl

              bg-zinc-100
              dark:bg-zinc-800

              flex
              items-center
              justify-center
            "
          >

            <X size={18} />

          </button>

        </div>

        <div className="space-y-4">

          <div
            className="
              bg-zinc-100
              dark:bg-zinc-900

              rounded-2xl

              p-4
            "
          >

            <p className="text-sm text-zinc-500 mb-2">
              AI Analysis
            </p>

            <p
              className="
                text-black
                dark:text-white

                leading-relaxed
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

                  border
                  border-blue-500/20

                  rounded-2xl

                  p-4
                "
              >

                <p
                  className="
                    text-sm
                    font-bold

                    text-blue-600

                    mb-2
                  "
                >
                  Follow-up IA
                </p>

                <p
                  className="
                    text-sm

                    text-blue-700
                    dark:text-blue-300

                    leading-relaxed
                  "
                >
                  {lead.ai_followup}
                </p>

              </div>

            )

          }

          <div
            className="
              border-t
              border-zinc-200
              dark:border-zinc-800

              pt-6
            "
          >

            <LeadNotes
              leadId={lead.id}
            />

            <LeadNotesList
              notes={
                Array.isArray(
                  lead.lead_notes
                )
                  ? lead.lead_notes
                  : []
              }
            />

            <LeadReminders
              leadId={lead.id}
            />

            <LeadRemindersList
              reminders={
                Array.isArray(
                  lead.reminders
                )
                  ? lead.reminders
                  : []
              }
            />

          </div>

          <div className="mt-10">

            <h3
              className="
                text-xl
                font-bold
                text-black
                dark:text-white

                mb-5
              "
            >
              Actividad
            </h3>

            <div className="space-y-4">

              {

                Array.isArray(
                  lead.activities
                ) &&
                lead.activities.length > 0 ? (

                  lead.activities.map(
                    (activity: any) => (

                      <div

                        key={activity.id}

                        className="
                          border
                          border-zinc-200
                          dark:border-zinc-800

                          rounded-2xl

                          p-4
                        "
                      >

                        <p
                          className="
                            text-sm
                            text-black
                            dark:text-white
                          "
                        >
                          {activity.description}
                        </p>

                        <p
                          className="
                            text-xs
                            text-zinc-500
                            mt-2
                          "
                        >
                          {

                            new Date(
                              activity.created_at
                            ).toLocaleString()

                          }
                        </p>

                      </div>

                    )

                  )

                ) : (

                  <p className="text-zinc-500">
                    Sin actividad todavía.
                  </p>

                )

              }

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}