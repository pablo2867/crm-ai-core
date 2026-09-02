import {
  LeadIntelligenceInput,
} from "./types";

export function calculatePersonality(
  input: LeadIntelligenceInput
): "premium" | "urgent" | "friendly" | "soft" {

  const score =
    input.aiScore ?? 0;

  const activities =
    input.activities ?? 0;

  const reminders =
    input.reminders ?? 0;

  if (
    score >= 85 &&
    activities >= 10
  ) {

    return "premium";

  }

  if (
    score >= 75 &&
    reminders >= 3
  ) {

    return "urgent";

  }

  if (
    score >= 60
  ) {

    return "friendly";

  }

  return "soft";

}