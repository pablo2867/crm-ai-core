import {
  LeadIntelligenceInput,
} from "./types";

export function calculateTemperature(
  input: LeadIntelligenceInput,
  score: number
): "HOT" | "WARM" | "COLD" {

  if (
    score >= 80 ||
    (input.aiScore ?? 0) >= 90
  ) {

    return "HOT";

  }

  if (
    score >= 50 ||
    (input.aiScore ?? 0) >= 60
  ) {

    return "WARM";

  }

  return "COLD";

}