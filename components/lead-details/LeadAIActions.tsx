"use client";

import { useState } from "react";

import LeadCoachResult
from "@/components/lead-details/LeadCoachResult";

import LeadEmailResult
from "@/components/lead-details/LeadEmailResult";

import LeadWhatsappResult
from "@/components/lead-details/LeadWhatsappResult";

type Props = {
  lead: any;
};

export default function LeadAIActions({
  lead,
}: Props) {

  const [
    coach,
    setCoach,
  ] = useState("");

  const [
    email,
    setEmail,
  ] = useState("");

  const [
    whatsapp,
    setWhatsapp,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  async function handleEmail() {

    try {

      console.log(
        "EMAIL CLICK"
      );

      const response =
        await fetch(
          "/api/email-generator",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              lead: lead.name,
              type: "followup",
            }),
          }
        );

      const data =
        await response.json();

      console.log(
        "EMAIL RESPONSE:",
        JSON.stringify(
          data,
          null,
          2
        )
      );

      if (data.success) {

        setEmail(
          data.email || ""
        );

      } else {

        setEmail(
          "No fue posible generar el email."
        );

      }

    } catch (error) {

      console.error(
        "EMAIL ERROR:",
        error
      );

      setEmail(
        "Error generando email."
      );

    }

  }

  async function handleWhatsapp() {

    try {

      console.log(
        "WHATSAPP CLICK"
      );

      const response =
        await fetch(
          "/api/whatsapp-generator",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              lead: lead.name,
              type: "followup",
            }),
          }
        );

      const data =
        await response.json();

      console.log(
        "WHATSAPP RESPONSE:",
        JSON.stringify(
          data,
          null,
          2
        )
      );

      console.log(
        "WHATSAPP TEXT:",
        data.whatsapp
      );

      if (data.success) {

        setWhatsapp(
          data.whatsapp || ""
        );

      } else {

        setWhatsapp(
          "No fue posible generar WhatsApp."
        );

      }

    } catch (error) {

      console.error(
        "WHATSAPP ERROR:",
        error
      );

      setWhatsapp(
        "Error generando WhatsApp."
      );

    }

  }

  async function handleDealCoach() {

    try {

      setLoading(true);

      console.log(
        "DEAL COACH CLICK"
      );

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
                lead.ai_score || 75,
              probability:
                lead.close_probability || 50,
              revenue:
                lead.deal_value || 0,
            }),
          }
        );

      const data =
        await response.json();

      console.log(
        "DEAL COACH RESPONSE:",
        JSON.stringify(
          data,
          null,
          2
        )
      );

      if (data.success) {

        setCoach(
          data.coach || ""
        );

      } else {

        setCoach(
          "No fue posible generar la recomendación."
        );

      }

    } catch (error) {

      console.error(
        "DEAL COACH ERROR:",
        error
      );

      setCoach(
        "Error generando recomendación."
      );

    } finally {

      setLoading(false);

    }

  }

  return (

    <>

      <div
        className="
          grid
          grid-cols-3
          gap-3
        "
      >

        <button
          onClick={
            handleEmail
          }
          className="
            bg-blue-600
            hover:bg-blue-700
            text-white
            rounded-xl
            py-3
            font-semibold
            transition
          "
        >
          📧 Email IA
        </button>

        <button
          onClick={
            handleWhatsapp
          }
          className="
            bg-green-600
            hover:bg-green-700
            text-white
            rounded-xl
            py-3
            font-semibold
            transition
          "
        >
          💬 WhatsApp IA
        </button>

        <button
          onClick={
            handleDealCoach
          }
          disabled={
            loading
          }
          className="
            bg-purple-600
            hover:bg-purple-700
            disabled:opacity-50
            text-white
            rounded-xl
            py-3
            font-semibold
            transition
          "
        >
          {
            loading
              ? "Generando..."
              : "🎯 Deal Coach"
          }
        </button>

      </div>

      <LeadCoachResult
        coach={coach}
      />

      <LeadEmailResult
        email={email}
      />

      <LeadWhatsappResult
        whatsapp={whatsapp}
      />

    </>

  );

}
