"use client";

import { useCallback, useEffect, useState } from "react";

export interface RuntimeHistoryEntry {

  id: string;

  createdAt: string;

  success: boolean;

  summary: string;

  workflow?: string;

  duration: number;

}

export interface RuntimeHistoryStats {

  totalExecutions: number;

  successfulExecutions: number;

  failedExecutions: number;

  averageDuration: number;

}

interface RuntimeHistoryResponse {

  success: boolean;

  latest?: RuntimeHistoryEntry;

  history: RuntimeHistoryEntry[];

  stats: RuntimeHistoryStats;

}

export function useRuntimeHistory() {

  const [history, setHistory] =
    useState<RuntimeHistoryEntry[]>([]);

  const [latest, setLatest] =
    useState<RuntimeHistoryEntry>();

  const [stats, setStats] =
    useState<RuntimeHistoryStats>();

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string>();

  const load =
    useCallback(async () => {

      try {

        setLoading(true);

        const response =
          await fetch(
            "/api/ai-runtime-history",
            {
              cache: "no-store",
            }
          );

        const data:
          RuntimeHistoryResponse =
            await response.json();

        if (!data.success) {

          throw new Error(
            "Runtime History Error"
          );

        }

        setLatest(
          data.latest
        );

        setHistory(
          data.history
        );

        setStats(
          data.stats
        );

        setError(
          undefined
        );

      } catch {

        setError(
          "No fue posible cargar el historial."
        );

      } finally {

        setLoading(false);

      }

    }, []);

  useEffect(() => {
    const initialTimer = setTimeout(() => {
      void load();
    }, 0);

    const timer = setInterval(
      load,
      5000
    );

    return () => {
      clearTimeout(initialTimer);
      clearInterval(timer);
    };
  }, [load]);

  return {

    latest,

    history,

    stats,

    loading,

    error,

    reload: load,

  };

}

