import type {
  Capability,
  CapabilityRequest,
  CapabilityResult,
} from "../types";

import {
  financialCopilotService,
} from "@/platform/financial/copilot";

import type {
  FinancialCopilotIntent,
} from "@/platform/financial/copilot";

export const financialAnalysisCapability: Capability = {

  id:
    "financial.analysis",

  name:
    "Financial Analysis",

  metadata: {

    category:
      "financial",

    priority:
      100,

    supportedIntents: [

      "financial.analysis",

      "financial",

    ],

    tags: [

      "financial",

      "finance",

      "analysis",

      "ratios",

      "forecast",

      "budget",

      "scenario",

      "sensitivity",

      "investment",

      "risk",

      "valuation",

      "report",

    ],

    modules: [

      "financial",

    ],

  },

  async execute(

    request: CapabilityRequest

  ): Promise<CapabilityResult> {

    if (!request.organizationId) {

      return {

        success:
          false,

        message:
          "No se recibió la organización.",

      };

    }

    if (!request.workspaceId) {

      return {

        success:
          false,

        message:
          "No se recibió el workspace.",

      };

    }

    const input =
      request.input ?? {};

    const intent =
      typeof input.financialIntent === "string"
        ? input.financialIntent
        : request.intent === "financial.analysis"
          ? "analysis"
          : undefined;

    const allowedIntents: FinancialCopilotIntent[] = [

      "analysis",
      "ratios",
      "forecast",
      "budget",
      "scenario",
      "sensitivity",
      "investment",
      "risk",
      "valuation",
      "report",

    ];

    const resolvedIntent =
      intent &&
      allowedIntents.includes(
        intent as FinancialCopilotIntent
      )
        ? intent as FinancialCopilotIntent
        : undefined;

    const result =
      await financialCopilotService.execute({

        context: {

          organizationId:
            request.organizationId,

          workspaceId:
            request.workspaceId,

          userId:
            request.userId,

        },

        message:
          request.goal,

        intent:
          resolvedIntent,

        periodId:
          typeof input.periodId === "string"
            ? input.periodId
            : undefined,

        classification:
          typeof input.classification === "string"
            ? input.classification as
                | "actual"
                | "forecast"
                | "assumption"
                | "scenario"
                | "external"
            : undefined,

      });

    return {

      success:
        true,

      message:
        "Financial Analysis procesado correctamente.",

      data:
        result,

    };

  },

};