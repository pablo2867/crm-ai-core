"use client";

import {
  useState,
  useEffect,
  useCallback,
} from "react";

import {
  supabase,
} from "@/lib/supabase";

import PipelineChart
from "@/components/PipelineChart";

import PipelineBoard
from "@/components/PipelineBoard";

export default function PipelineClient({
  leads,
}: any) {

  const [
    liveLeads,
    setLiveLeads,
  ] = useState(leads);

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    filter,
    setFilter,
  ] = useState("ALL");

  const fetchLeads =
    useCallback(async () => {

      try {

        const res =
          await fetch(
            "/api/leads"
          );

        const data =
          await res.json();

        if (
          data?.leads
        ) {

          setLiveLeads(
            data.leads
          );

        }

      } catch (err) {

        console.log(err);

      }

    }, []);

  useEffect(() => {

    fetchLeads();

    const channel =
      supabase

        .channel(
          "realtime-leads"
        )

        .on(

          "postgres_changes",

          {
            event: "*",

            schema: "public",

            table: "leads",
          },

          () => {

            fetchLeads();

          }

        )

        .subscribe();

    return () => {

      supabase.removeChannel(
        channel
      );

    };

  }, [fetchLeads]);

  const filtered =
    liveLeads.filter(
      (lead: any) => {

        const text =
          `
            ${lead.name}
            ${lead.company}
            ${lead.email}
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
      (lead: any) =>
        lead.ai_temperature === "HOT"
    ).length;

  const remindersPending =
    filtered.reduce(
      (
        total: number,
        lead: any
      ) =>

        total +
        (
          lead.reminders?.filter(
            (r: any) =>
              !r.completed
          ).length || 0
        ),

      0
    );

  const avgScore =
    filtered.length > 0

      ? Math.round(

          filtered.reduce(
            (
              total: number,
              lead: any
            ) =>

              total +
              (lead.ai_score || 0),

            0
          ) / filtered.length

        )

      : 0;

  const closedDeals =
    filtered.filter(
      (lead: any) =>
        lead.status === "Cerrado"
    ).length;

  const nuevos =
    filtered.filter(
      (lead: any) =>
        lead.status === "Nuevo"
    );

  const contactados =
    filtered.filter(
      (lead: any) =>
        lead.status ===
        "Contactado"
    );

  const cerrados =
    filtered.filter(
      (lead: any) =>
        lead.status ===
        "Cerrado"
    );

  const columns = [

    {
      title: "Nuevo",
      leads: nuevos,
    },

    {
      title: "Contactado",
      leads: contactados,
    },

    {
      title: "Cerrado",
      leads: cerrados,
    },

  ];

  return (

    <div>

      <div className="mb-8 space-y-4">

        <input
          type="text"

          placeholder="🔎 Buscar lead..."

          value={search}

          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }

          className="
            w-full

            bg-white
            dark:bg-[#111113]

            border
            border-zinc-200
            dark:border-zinc-800

            rounded-2xl

            px-5 py-4

            text-black
            dark:text-white

            outline-none

            focus:ring-2
            focus:ring-blue-500
          "
        />

        <div className="flex flex-wrap gap-3">

          {

            [
              "ALL",
              "HOT",
              "WARM",
              "COLD",
            ].map((item) => (

              <button

                key={item}

                onClick={() =>
                  setFilter(item)
                }

                className={`
                  px-4 py-2 rounded-xl text-sm font-medium transition

                  ${
                    filter === item
                      ? "bg-blue-600 text-white"
                      : "bg-white dark:bg-[#111113] border border-zinc-200 dark:border-zinc-800"
                  }
                `}
              >

                {item}

              </button>

            ))

          }

        </div>

      </div>

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-4

          gap-6

          mb-10
        "
      >

        <div
          className="
            bg-white
            dark:bg-[#111113]

            border
            border-zinc-200
            dark:border-zinc-800

            rounded-3xl

            p-6
          "
        >

          <p className="text-zinc-500 text-sm">
            HOT Leads
          </p>

          <h2
            className="
              text-4xl
              font-black
              text-red-500
              mt-2
            "
          >
            🔥 {hotLeads}
          </h2>

        </div>

        <div
          className="
            bg-white
            dark:bg-[#111113]

            border
            border-zinc-200
            dark:border-zinc-800

            rounded-3xl

            p-6
          "
        >

          <p className="text-zinc-500 text-sm">
            Reminders
          </p>

          <h2
            className="
              text-4xl
              font-black
              text-yellow-500
              mt-2
            "
          >
            📅 {remindersPending}
          </h2>

        </div>

        <div
          className="
            bg-white
            dark:bg-[#111113]

            border
            border-zinc-200
            dark:border-zinc-800

            rounded-3xl

            p-6
          "
        >

          <p className="text-zinc-500 text-sm">
            Score Promedio
          </p>

          <h2
            className="
              text-4xl
              font-black
              text-blue-500
              mt-2
            "
          >
            ⚡ {avgScore}
          </h2>

        </div>

        <div
          className="
            bg-white
            dark:bg-[#111113]

            border
            border-zinc-200
            dark:border-zinc-800

            rounded-3xl

            p-6
          "
        >

          <p className="text-zinc-500 text-sm">
            Cerrados
          </p>

          <h2
            className="
              text-4xl
              font-black
              text-green-500
              mt-2
            "
          >
            💰 {closedDeals}
          </h2>

        </div>

      </div>

      <PipelineChart
        filtered={filtered}
      />

      <PipelineBoard
        columns={columns}
      />

    </div>

  );

}