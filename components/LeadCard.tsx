"use client";

import {
  memo,
  useState,
} from "react";

import dynamic from "next/dynamic";

import LeadCardHeader from "@/components/lead-card/LeadCardHeader";
import LeadCardBadges from "@/components/lead-card/LeadCardBadges";
import LeadCardAnalysis from "@/components/lead-card/LeadCardAnalysis";
import LeadCardActions from "@/components/lead-card/LeadCardActions";

import type {
  LeadCardProps,
} from "@/components/lead-card/types";

const LeadCardModals = dynamic(
  () =>
    import(
      "@/components/lead-card/LeadCardModals"
    ),
  {
    ssr: false,
  }
);

function LeadCard({

  lead,

}: LeadCardProps) {

  const [open, setOpen] =
    useState(false);

  const [editOpen, setEditOpen] =
    useState(false);

  const [aiOpen, setAiOpen] =
    useState(false);

  const [aiText, setAiText] =
    useState("");

  return (

    <>

      <div
        className={`
          group
          relative
          rounded-3xl
          p-4
          space-y-4
          shadow-sm
          hover:shadow-2xl
          hover:-translate-y-1
          transition-all
          duration-300

          ${
            lead.ai_temperature === "HOT"

              ? `
                bg-red-500/5
                border border-red-500/30
                hover:border-red-500
                shadow-red-500/10
              `

              : lead.ai_temperature === "WARM"

              ? `
                bg-yellow-500/5
                border border-yellow-500/20
                hover:border-yellow-500
              `

              : `
                bg-white
                dark:bg-[#111113]
                border
                border-zinc-200
                dark:border-zinc-800
                hover:border-blue-500/30
              `
          }
        `}
      >

        <LeadCardHeader
          lead={lead}
        />

        <LeadCardBadges
          lead={lead}
        />

        <LeadCardAnalysis
          lead={lead}
        />

        <LeadCardActions
          lead={lead}
          setOpen={setOpen}
          setEditOpen={setEditOpen}
          setAiOpen={setAiOpen}
          setAiText={setAiText}
        />

      </div>

      <LeadCardModals
        lead={lead}
        open={open}
        setOpen={setOpen}
        editOpen={editOpen}
        setEditOpen={setEditOpen}
        aiOpen={aiOpen}
        setAiOpen={setAiOpen}
        aiText={aiText}
      />

    </>

  );

}

export default memo(LeadCard);