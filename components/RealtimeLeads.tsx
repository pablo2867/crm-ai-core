"use client";

import { useEffect } from "react";

import { supabase } from "@/lib/supabase";

import toast, { Toaster }
from "react-hot-toast";

export default function RealtimeLeads() {

  useEffect(() => {

    const channel = supabase
      .channel("realtime-leads")

      .on(
        "postgres_changes",

        {
          event: "INSERT",
          schema: "public",
          table: "leads",
        },

        () => {

          toast.success(
            "Nuevo lead recibido 🚀"
          );

          const audio = new Audio(
            "/sounds/notification.mp3"
          );

          audio.play();

          window.location.reload();
        }
      )

      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };

  }, []);

  return (
    <Toaster
      position="top-right"
    />
  );
}