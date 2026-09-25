"use client";

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

import {
  useCopilotDashboard,
} from "@/hooks/useCopilotDashboard";

import {
  useCopilotChat,
} from "@/hooks/useCopilotChat";

export default function CopilotPage() {
  const {
    forecastRevenue,
    hotLeads,
    conversionRate,
    businessSummary,
    radarData,
  } = useCopilotDashboard();

  const {
    question,
    setQuestion,
    loading,
    messages,
    askCopilot,
  } = useCopilotChat();

  return (
    <main className="min-h-screen bg-[#09090B] text-white p-6 md:p-10">
      <CopilotHeader />

      <CopilotInsights
        forecastRevenue={forecastRevenue}
        hotLeads={hotLeads}
        conversionRate={conversionRate}
      />

      <AIBusinessSummary
        summary={businessSummary}
        forecastRevenue={forecastRevenue}
        hotLeads={hotLeads}
        conversionRate={conversionRate}
      />

      <AIOpportunityRadar data={radarData} />

      <AIActionCenter data={radarData} />

      <AIFollowUpGenerator />

      <AIEmailGenerator />

      <AIWhatsAppGenerator />

      <AIDealCoach data={radarData} />

      <div className="bg-[#111113] border border-zinc-800 rounded-3xl p-6 h-[70vh] flex flex-col">
        <CopilotMessages messages={messages} />

        <CopilotQuickActions
          askCopilot={askCopilot}
        />

        <CopilotInput
          question={question}
          setQuestion={setQuestion}
          loading={loading}
          askCopilot={() => askCopilot()}
        />
      </div>
    </main>
  );
}