"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

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
              payload.new as {
                type?: string;
              };

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

            if (
              activity.type ===
              "AI EMAIL"
            ) {

              toast.success(
                "🤖 AI generó email comercial"
              );

            }

            if (
              activity.type ===
              "AI COPILOT"
            ) {

              toast.success(
                "🧠 AI Copilot ejecutó acción"
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
              payload.new as {
                name?: string;
                ai_temperature?: string;
              };

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
