"use client";

import { useState } from "react";

import DealCoachModal from "../DealCoachModal";

interface Props {
  lead: any;
}

export default function DealCoachButton({
  lead,
}: Props) {

  const [loading, setLoading] =
    useState(false);

  const [coach, setCoach] =
    useState("");

  const [showCoach, setShowCoach] =
    useState(false);

  async function runDealCoach(
    e: React.MouseEvent
  ) {

    e.stopPropagation();

    setLoading(true);

    try {

      const response =
        await fetch(
          "/api/deal-coach",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({

              lead:
                lead.name,

              score:
                lead.ai_score || 0,

              probability:
                lead.close_probability || 0,

              revenue:
                lead.estimated_revenue ||
                lead.deal_value ||
                0,

            }),

          }
        );

      const data =
        await response.json();

      setCoach(
        data.coach ||
        "Sin respuesta"
      );

      setShowCoach(true);

    } catch (error) {

      console.log(
        "DEAL COACH ERROR:",
        error
      );

      setCoach(
        "Error generando recomendación."
      );

      setShowCoach(true);

    } finally {

      setLoading(false);

    }

  }

  return (

    <>

      <button
        type="button"
        onClick={runDealCoach}
        className="
          flex-1

          bg-blue-600
          hover:bg-blue-700

          text-white

          text-xs
          font-semibold

          py-2

          rounded-lg

          transition
        "
      >
        {loading
          ? "Analizando..."
          : "🤖 IA"}
      </button>

      <DealCoachModal
        open={showCoach}
        coach={coach}
        onClose={() =>
          setShowCoach(false)
        }
      />

    </>

  );

}
