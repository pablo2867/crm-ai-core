"use client";

import dynamic from "next/dynamic";

import {
  useState,
  useCallback,
} from "react";

import { supabase } from "@/lib/supabase";

import type {
  Lead,
} from "@/platform/services/lead-service";

import PipelineChart from "@/components/PipelineChart";
import PipelineFilters from "@/components/pipeline/PipelineFilters";
import PipelineStats from "@/components/pipeline/PipelineStats";

import AIInsights from "@/components/AIInsights";
import AIRecommendations from "@/components/AIRecommendations";

const PipelineBoardV3 = dynamic(
  () =>
    import(
      "@/components/pipeline-v3/PipelineBoardV3"
    ),
  {
    ssr: false,

    loading: () => (
      <div
        className="
          p-10
          text-center
          text-zinc-500
        "
      >
        Cargando pipeline...
      </div>
    ),
  }
);

interface PipelineClientProps {

  leads: Lead[];

}

export default function PipelineClient({

  leads,

}: PipelineClientProps) {

  const [liveLeads, setLiveLeads] =
    useState<Lead[]>(leads);

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState("ALL");

  const fetchLeads =
    useCallback(async () => {

      try {

        const res =
          await fetch(
            "/api/leads"
          );

        const data =
          await res.json();

        if (data?.leads) {

          setLiveLeads(
            data.leads
          );

        }

      } catch (err) {

        console.log(
          "FETCH LEADS ERROR:",
          err
        );

      }

    }, []);

  /*
  ============================================
  REALTIME DESACTIVADO TEMPORALMENTE
  ============================================

  useEffect(() => {

    const channel =
      supabase
        .channel("realtime-leads")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "leads",
          },
          () => fetchLeads()
        )
        .subscribe();

    return () => {

      supabase.removeChannel(channel);

    };

  }, [fetchLeads]);

  */

  async function moveLead(
    leadId: number,
    newStage: string
  ) {

    const previousLeads =
      [...liveLeads];

    setLiveLeads(

      (current: Lead[]) =>

        current.map(

          (lead) =>

            lead.id === leadId

              ? {

                  ...lead,

                  pipeline_stage:
                    newStage,

                }

              : lead

        )

    );

    try {

      const response =
        await fetch(

          "/api/update-status",

          {

            method: "POST",

            headers: {

              "Content-Type":
                "application/json",

            },

            body: JSON.stringify({

              id: leadId,

              pipeline_stage:
                newStage,

            }),

          }

        );

      if (!response.ok) {

        setLiveLeads(
          previousLeads
        );

      }

    } catch (error) {

      console.log(
        "MOVE ERROR:",
        error
      );

      setLiveLeads(
        previousLeads
      );

    }

  }

  const filtered =
    liveLeads.filter(

      (lead: Lead) => {

        const text = `
          ${lead.name ?? ""}
          ${lead.company ?? ""}
          ${lead.email ?? ""}
        `
          .toLowerCase();

        const matchesSearch =
          text.includes(
            search.toLowerCase()
          );

        const matchesFilter =
          filter === "ALL"

            ? true

            : lead.ai_temperature ===
              filter;

        return (

          matchesSearch &&

          matchesFilter

        );

      }

    );

  const hotLeads =
    filtered.filter(

      (lead: Lead) =>

        lead.ai_temperature ===
        "HOT"

    ).length;

  const warmLeads =
    filtered.filter(

      (lead: Lead) =>

        lead.ai_temperature ===
        "WARM"

    ).length;

  const remindersPending =
    filtered.reduce(

      (

        total: number,

        lead: Lead

      ) =>

        total +

        (

          lead.reminders?.filter(

            (r: any) =>

              !r.completed

          ).length ?? 0

        ),

      0

    );

  const avgScore =

    filtered.length > 0

      ? Math.round(

          filtered.reduce(

            (

              total: number,

              lead: Lead

            ) =>

              total +

              (lead.ai_score ?? 0),

            0

          ) /

            filtered.length

        )

      : 0;

  const closedDeals =
    filtered.filter(

      (lead: Lead) =>

        lead.pipeline_stage ===
        "closed_won"

    ).length;

  const nuevos =
    filtered.filter(
      (lead: Lead) =>
        lead.pipeline_stage ===
        "new"
    );

  const contactados =
    filtered.filter(
      (lead: Lead) =>
        lead.pipeline_stage ===
        "contacted"
    );

  const calificados =
    filtered.filter(
      (lead: Lead) =>
        lead.pipeline_stage ===
        "qualified"
    );

  const propuestas =
    filtered.filter(
      (lead: Lead) =>
        lead.pipeline_stage ===
        "proposal"
    );

  const negociacion =
    filtered.filter(
      (lead: Lead) =>
        lead.pipeline_stage ===
        "negotiation"
    );

  const ganados =
    filtered.filter(
      (lead: Lead) =>
        lead.pipeline_stage ===
        "closed_won"
    );

  const perdidos =
    filtered.filter(
      (lead: Lead) =>
        lead.pipeline_stage ===
        "closed_lost"
    );

  const columns = [

    {

      title: "new",

      leads: nuevos,

    },

    {

      title: "contacted",

      leads: contactados,

    },

    {

      title: "qualified",

      leads: calificados,

    },

    {

      title: "proposal",

      leads: propuestas,

    },

    {

      title: "negotiation",

      leads: negociacion,

    },

    {

      title: "closed_won",

      leads: ganados,

    },

    {

      title: "closed_lost",

      leads: perdidos,

    },

  ];

  return (

    <div>

      <AIInsights

        totalLeads={
          filtered.length
        }

        hotLeads={
          hotLeads
        }

        warmLeads={
          warmLeads
        }

        cerrados={
          closedDeals
        }

      />

      <AIRecommendations

        leads={filtered}

      />

      <PipelineFilters

        search={search}

        setSearch={setSearch}

        filter={filter}

        setFilter={setFilter}

      />

      <PipelineStats

        hotLeads={hotLeads}

        remindersPending={
          remindersPending
        }

        avgScore={
          avgScore
        }

        closedDeals={
          closedDeals
        }

      />

      <PipelineChart

        filtered={filtered}

      />

      <PipelineBoardV3

        columns={columns}

        onMoveLead={moveLead}

      />

    </div>

  );

}