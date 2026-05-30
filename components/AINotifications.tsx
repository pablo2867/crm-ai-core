"use client";

import {
  useEffect,
} from "react";

import {
  toast,
} from "sonner";

import {
  supabase,
} from "@/lib/supabase";

export default function AINotifications() {

  useEffect(() => {

    const channel =

      supabase

        .channel(
          "ai-live-notifications"
        )

        // ACTIVITIES

        .on(

          "postgres_changes",

          {
            event: "INSERT",

            schema: "public",

            table: "activities",
          },

          (payload) => {

            const activity =
              payload.new as any;

            if (
              activity.type ===
              "AUTO FOLLOWUP"
            ) {

              toast.success(

                "🤖 AI generó followup automático"

              );

            }

            if (
              activity.type ===
              "AUTO REMINDER"
            ) {

              toast(

                "📅 Reminder automático creado"

              );

            }

            if (
              activity.type ===
              "AI STATUS"
            ) {

              toast(

                "🔥 AI actualizó temperatura del lead"

              );

            }

          }

        )

        // HOT LEADS

        .on(

          "postgres_changes",

          {
            event: "UPDATE",

            schema: "public",

            table: "leads",
          },

          (payload) => {

            const lead =
              payload.new as any;

            if (
              lead.ai_temperature ===
              "HOT"
            ) {

              toast.success(

                `🔥 ${lead.name} ahora es HOT lead`

              );

            }

          }

        )

        .subscribe();

    return () => {

      supabase.removeChannel(
        channel
      );

    };

  }, []);

  return null;

}