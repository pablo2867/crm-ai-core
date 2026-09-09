"use client";

import { useDraggable } from "@dnd-kit/core";

import LeadProbabilityBar from "./card/LeadProbabilityBar";
import LeadRevenue from "./card/LeadRevenue";
import LeadContactInfo from "./card/LeadContactInfo";
import DealCoachButton from "./card/DealCoachButton";

interface Props {
  lead: any;
}

export default function PipelineCardV3({
  lead,
}: Props) {

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
  } = useDraggable({
    id: String(lead.id),
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const temperatureColor =
    lead.ai_temperature === "HOT"
      ? "text-red-400"
      : lead.ai_temperature === "WARM"
      ? "text-yellow-400"
      : "text-blue-400";

  const probability =
    lead.close_probability ||
    lead.ai_score ||
    0;

  const revenue =
    Number(
      lead.estimated_revenue ||
      lead.deal_value ||
      0
    );

  return (

    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="
        bg-[#18181B]
        border
        border-zinc-800
        rounded-2xl
        p-4
        hover:border-blue-500/40
        hover:shadow-xl
        transition-all
        cursor-grab
        select-none
      "
    >

      <div className="flex items-center gap-3">

        <div
          className="
            w-10
            h-10
            rounded-full
            bg-gradient-to-br
            from-blue-500
            to-purple-500
            flex
            items-center
            justify-center
            text-white
            font-bold
          "
        >
          {lead.name?.charAt(0)?.toUpperCase()}
        </div>

        <div className="flex-1">

          <h3
            className="
              text-white
              font-semibold
            "
          >
            {lead.name}
          </h3>

          <p
            className="
              text-zinc-400
              text-sm
            "
          >
            {lead.company || "Sin empresa"}
          </p>

        </div>

      </div>

      <div
        className="
          mt-4
          flex
          items-center
          justify-between
        "
      >

        <span
          className={`
            text-sm
            font-semibold
            ${temperatureColor}
          `}
        >
          🔥 {lead.ai_temperature || "N/A"}
        </span>

        <span
          className="
            text-zinc-300
            text-sm
            font-semibold
          "
        >
          ⚡ {lead.ai_score || 0}
        </span>

      </div>

      <LeadProbabilityBar
        probability={probability}
      />

      <LeadRevenue
        revenue={revenue}
      />

      <LeadContactInfo
        email={lead.email}
        phone={lead.phone}
      />

      <div
        className="
          mt-4
          flex
          gap-2
        "
      >

        <DealCoachButton
          lead={lead}
        />

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
              text-center
              text-white
              text-xs
              font-semibold
              py-2
              rounded-lg
              transition
            "
          >
            WhatsApp
          </a>

        )}

      </div>

    </div>

  );

}
