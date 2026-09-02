export class LeadScore {

  calculate(input: {

    company?: string;

    email?: string;

    phone?: string;

  }): number {

    let score = 60;

    if (
      input.company &&
      input.company.length > 3
    ) {

      score += 10;

    }

    if (input.phone) {

      score += 10;

    }

    if (
      input.email?.includes("@gmail")
    ) {

      score += 5;

    }

    if (
      input.email?.includes("@company")
    ) {

      score += 20;

    }

    return score;

  }

}

export const leadScore =
  new LeadScore();