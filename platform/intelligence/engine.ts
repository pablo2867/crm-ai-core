import {
  LeadIntelligenceInput,
  LeadIntelligenceResult,
} from "./types";

import {
  calculateLeadScore,
} from "./scorer";

import {
  calculateTemperature,
} from "./temperature";

import {
  calculatePersonality,
} from "./personality";

import {
  activityIntelligenceEngine,
} from "./activity";

import type {
  LeadActivity,
} from "@/platform/domain/lead/types";

export class IntelligenceEngine {

  evaluateLead(
    input: LeadIntelligenceInput
  ): LeadIntelligenceResult {

    const score =
      calculateLeadScore(input);

    const temperature =
      calculateTemperature(
        input,
        score
      );

    const personality =
      calculatePersonality(
        input
      );

    let priority =
      score;

    if (
      temperature === "HOT"
    ) {

      priority += 20;

    }

    if (
      personality === "premium"
    ) {

      priority += 15;

    }

    let risk:
      | "LOW"
      | "MEDIUM"
      | "HIGH" =
      "LOW";

    if (score < 50) {

      risk = "HIGH";

    } else if (score < 80) {

      risk = "MEDIUM";

    }

    return {

      score,

      temperature,

      personality,

      priority,

      risk,

    };

  }

  evaluateLeadRecord(
    lead: {

      email?: string | null;

      phone?: string | null;

      company?: string | null;

      message?: string | null;

      status?: string | null;

      ai_score?: number;

      activities?:
        | LeadActivity[]
        | number;

      reminders?:
        | unknown[]
        | number;

    }

  ): LeadIntelligenceResult {

    const activitiesCount =
      Array.isArray(
        lead.activities
      )
        ? lead.activities.length
        : (lead.activities ?? 0);

    const reminders =
      Array.isArray(
        lead.reminders
      )
        ? lead.reminders.length
        : (lead.reminders ?? 0);

    const activity =

      Array.isArray(
        lead.activities
      )

        ? activityIntelligenceEngine.analyze({

            activities:
              lead.activities,

          })

        : undefined;

    const intelligence =
      this.evaluateLead({

        email:
          lead.email,

        phone:
          lead.phone,

        company:
          lead.company,

        message:
          lead.message,

        status:
          lead.status,

        aiScore:
          lead.ai_score,

        activities:
          activitiesCount,

        reminders,

      });

    return {

      ...intelligence,

      activity,

    };

  }

}

export const intelligenceEngine =
  new IntelligenceEngine();