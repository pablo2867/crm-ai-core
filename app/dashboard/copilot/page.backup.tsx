"use client";

import {
  useEffect,
  useState,
} from "react";

import CopilotHeader from "@/components/copilot/CopilotHeader";
import CopilotInsights from "@/components/copilot/CopilotInsights";
import AIBusinessSummary from "@/components/copilot/AIBusinessSummary";
import AIOpportunityRadar from "@/components/copilot/AIOpportunityRadar";
import AIActionCenter from "@/components/copilot/AIActionCenter";
import AIFollowUpGenerator from "@/components/copilot/AIFollowUpGenerator";
import AIEmailGenerator from "@/components/copilot/AIEmailGenerator";
import AIWhatsAppGenerator from "@/components/copilot/AIWhatsAppGenerator";
import AIDealCoach from "@/components/copilot/AIDealCoach";
import CopilotMessages from "@/components/copilot/CopilotMessages";
import CopilotQuickActions from "@/components/copilot/CopilotQuickActions";
import CopilotInput from "@/components/copilot/CopilotInput";

export default function CopilotPage() {

  const [question, setQuestion] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [messages, setMessages] =
    useState<any[]>([]);

  const [radarData, setRadarData] =
    useState<any>(null);

  const [
    businessSummary,
    setBusinessSummary,
  ] = useState(
    "Generando resumen ejecutivo..."
  );

  const [
    forecastRevenue,
    setForecastRevenue,
  ] = useState(0);

  const [
    hotLeads,
    setHotLeads,
  ] = useState(0);

  const [
    conversionRate,
    setConversionRate,
  ] = useState(0);

  useEffect(() => {

    async function loadCopilotDashboard() {

      try {

        const response =
          await fetch(
            "/api/copilot-dashboard",
            {
              cache: "no-store",
            }
          );

        const data =
          await response.json();

        if (!data.success) {
          return;
        }

        setForecastRevenue(
          data.forecastRevenue || 0
        );

        setHotLeads(
          data.hotLeads || 0
        );

        setConversionRate(
          data.conversionRate || 0
        );

        setBusinessSummary(
          data.summary || ""
        );

        setRadarData({
          bestLead:
            data.bestLead,

          score:
            data.score,

          probability:
            data.probability,

          revenue:
            data.revenue,

          riskLeads:
            data.riskLeads,
        });

      } catch (err) {

        console.error(
          "COPILOT DASHBOARD ERROR:",
          err
        );

      }

    }

    loadCopilotDashboard();

  }, []);

  async function askCopilot(
    customQuestion?: string
  ) {

    const finalQuestion =
      customQuestion ||
      question;

    if (!finalQuestion) return;

    setLoading(true);

    const userMessage = {
      role: "user",
      content: finalQuestion,
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);

    try {

      const response =
        await fetch(
          "/api/ai-copilot",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              question:
                finalQuestion,
            }),
          }
        );

      const data =
        await response.json();

      const aiMessage = {
        role: "assistant",
        content:
          "🤖 Analizando leads...",
      };

      setMessages((prev) => [
        ...prev,
        aiMessage,
      ]);

      const words =
        (data.answer || "")
          .split(" ");

      let currentText = "";

      for (const word of words) {

        currentText +=
          word + " ";

        await new Promise(
          (resolve) =>
            setTimeout(
              resolve,
              35
            )
        );

        setMessages((prev) => {

          const updated =
            [...prev];

          updated[
            updated.length - 1
          ] = {
            role:
              "assistant",
            content:
              currentText,
          };

          return updated;

        });

      }

    } catch (err) {

      console.error(
        "AI COPILOT ERROR:",
        err
      );

    }

    setQuestion("");

    setLoading(false);

  }

  return (

    <main
      className="
        min-h-screen
        bg-[#09090B]
        text-white
        p-6
        md:p-10
      "
    >

      <CopilotHeader />

      <CopilotInsights
        forecastRevenue={
          forecastRevenue
        }
        hotLeads={
          hotLeads
        }
        conversionRate={
          conversionRate
        }
      />

      <AIBusinessSummary
        summary={
          businessSummary
        }
        forecastRevenue={
          forecastRevenue
        }
        hotLeads={
          hotLeads
        }
        conversionRate={
          conversionRate
        }
      />

      <AIOpportunityRadar
        data={radarData}
      />

      <AIActionCenter
        data={radarData}
      />

      <AIFollowUpGenerator />

      <AIEmailGenerator />

      <AIWhatsAppGenerator />

      <AIDealCoach
        data={radarData}
      />

      <div
        className="
          bg-[#111113]
          border
          border-zinc-800
          rounded-3xl
          p-6
          h-[70vh]
          flex
          flex-col
        "
      >

        <CopilotMessages
          messages={messages}
        />

        <CopilotQuickActions
          askCopilot={
            askCopilot
          }
        />

        <CopilotInput
          question={question}
          setQuestion={
            setQuestion
          }
          loading={loading}
          askCopilot={() =>
            askCopilot()
          }
        />

      </div>

    </main>

  );

}