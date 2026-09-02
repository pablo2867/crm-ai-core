import {
  LeadIntelligenceInput,
} from "./types";

export function calculateLeadScore(
  input: LeadIntelligenceInput
): number {

  let score = 0;

  if (input.email) {
    score += 20;
  }

  if (input.phone) {
    score += 20;
  }

  if (input.company) {
    score += 15;
  }

  if (
    input.message &&
    input.message.length > 30
  ) {
    score += 25;
  }

  switch (input.status) {

    case "Contactado":
      score += 15;
      break;

    case "Cerrado":
      score += 30;
      break;

  }

  return Math.min(score, 100);

}