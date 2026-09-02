"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import type {
  DecisionResponse,
} from "@/platform/decision";

import type {
  DecisionExplanation,
} from "@/platform/decision/explanation";

import type {
  WorkflowResult,
} from "@/platform/workflows";

import type {
  ExecutionPlan,
} from "@/platform/planner";

import type {
  ValidationEngineResult,
} from "@/platform/validation";

import type {
  RuntimeResult,
} from "@/platform/runtime";

import type {
  MetricReport,
} from "@/platform/metrics";

import type {
  RuntimeHistoryEntry,
  RuntimeHistoryStats,
} from "@/platform/runtime/history";

import type {
  AIHealthReport,
} from "@/platform/ai-health";

export interface AICommandCenterData {

  success: boolean;

  decision: DecisionResponse | null;

  /*
  ---------------------------------------
  Explainable AI
  ---------------------------------------
  */

  explanation: DecisionExplanation | null;

  validation: ValidationEngineResult | null;

  workflow: WorkflowResult | null;

  plan: ExecutionPlan | null;

  runtime: RuntimeResult | null;

  timeline: RuntimeResult["steps"];

  /*
  ---------------------------------------
  Runtime Metrics
  ---------------------------------------
  */

  metrics: MetricReport[];

  /*
  ---------------------------------------
  AI Health
  ---------------------------------------
  */

  health: AIHealthReport | null;

  /*
  ---------------------------------------
  Runtime History
  ---------------------------------------
  */

  history: RuntimeHistoryEntry[];

  historyStats: RuntimeHistoryStats | null;

}

const initialState: AICommandCenterData = {

  success: false,

  decision: null,

  explanation: null,

  validation: null,

  workflow: null,

  plan: null,

  runtime: null,

  timeline: [],

  metrics: [],

  health: null,

  history: [],

  historyStats: null,

};

export function useAICommandCenter() {

  const [

    data,

    setData,

  ] = useState<AICommandCenterData>(

    initialState

  );

  const [

    loading,

    setLoading,

  ] = useState(true);

  const refresh = useCallback(

    async () => {

      try {

        setLoading(true);

        const response =
          await fetch(

            "/api/ai-command-center",

            {

              cache: "no-store",

            }

          );

        const json =
          await response.json();

        setData({

          ...initialState,

          ...json,

          explanation:
            json.decision?.explanation ?? null,

          health:
            json.health ?? null,

        });

      } catch (error) {

        console.error(

          "AI Command Center:",

          error

        );

      } finally {

        setLoading(false);

      }

    },

    []

  );

  useEffect(() => {
    const timer = setTimeout(() => {
      void refresh();
    }, 0);

    return () => clearTimeout(timer);
  }, [refresh]);

  return {

    data,

    loading,

    refresh,

  };

}

