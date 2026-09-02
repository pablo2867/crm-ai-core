import { X } from "lucide-react";

import LeadInfoCards from "@/components/lead-details/LeadInfoCards";
import LeadAIActions from "@/components/lead-details/LeadAIActions";
import LeadAIAnalysis from "@/components/lead-details/LeadAIAnalysis";
import LeadFollowup from "@/components/lead-details/LeadFollowup";

import LeadNotes from "@/components/LeadNotes";
import LeadNotesList from "@/components/LeadNotesList";

import LeadReminders from "@/components/LeadReminders";
import LeadRemindersList from "@/components/LeadRemindersList";

import LeadActivity from "@/components/lead-details/LeadActivity";

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
        <div className="flex items-start justify-between gap-4">
          <div className="w-full">
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

            <p className="text-zinc-500 mt-1 mb-4">
              {lead.company}
            </p>

            <LeadInfoCards lead={lead} />

            <div className="mt-4">
              <LeadAIActions lead={lead} />
            </div>

            <div className="mt-4">
              <LeadAIAnalysis lead={lead} />
            </div>

            <div className="mt-4">
              <LeadFollowup lead={lead} />
            </div>

            <div className="mt-8">
              <LeadNotes leadId={lead.id} />

              <LeadNotesList
                notes={
                  Array.isArray(
                    lead.lead_notes
                  )
                    ? lead.lead_notes
                    : []
                }
              />
            </div>

            <div className="mt-8">
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

            <div className="mt-8">
              <LeadActivity
                lead={lead}
              />
            </div>
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
              shrink-0
            "
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}