export class LeadTemperature {

  calculate(
    score: number,
  ): string {

    if (score >= 85) {

      return "HOT";

    }

    if (score <= 50) {

      return "COLD";

    }

    return "WARM";

  }

}

export const leadTemperature =
  new LeadTemperature();