import type {
  LeadActivity,
} from "@/platform/domain/lead/types";

import type {
  ActivityAnalysisRequest,
  ActivityIntelligence,
} from "./types";

export function analyzeActivities(
  request: ActivityAnalysisRequest
): ActivityIntelligence {

  const activities =
    request.activities ?? [];

  const followups =
    activities.filter(
      activity =>
        activity.type === "followup"
    ).length;

  const emails =
    activities.filter(
      activity =>
        activity.type === "email"
    ).length;

  const calls =
    activities.filter(
      activity =>
        activity.type === "call"
    ).length;

  const meetings =
    activities.filter(
      activity =>
        activity.type === "meeting"
    ).length;

  const tasks =
    activities.filter(
      activity =>
        activity.type === "task"
    ).length;

  const notes =
    activities.filter(
      activity =>
        activity.type === "note"
    ).length;

  const sorted =
    [...activities].sort(

      (a, b) =>

        new Date(
          b.createdAt
        ).getTime()

        -

        new Date(
          a.createdAt
        ).getTime()

    );

  const lastActivity =
    sorted[0];

  let inactivityDays = 0;

  if (lastActivity) {

    const diff =

      Date.now()

      -

      new Date(
        lastActivity.createdAt
      ).getTime();

    inactivityDays = Math.floor(

      diff /

      (1000 * 60 * 60 * 24)

    );

  }

  let engagementScore = 100;

  engagementScore -= inactivityDays;

  if (engagementScore < 0) {

    engagementScore = 0;

  }

  let recommendation =
    "Continuar seguimiento.";

  if (inactivityDays >= 14) {

    recommendation =
      "Reactivar el lead.";

  } else if (

    followups >= 5

  ) {

    recommendation =
      "Cambiar estrategia comercial.";

  }

  return {

    totalActivities:
      activities.length,

    followups,

    emails,

    calls,

    meetings,

    tasks,

    notes,

    lastActivity,

    inactivityDays,

    engagementScore,

    recommendation,

  };

}