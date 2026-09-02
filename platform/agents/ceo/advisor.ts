import type {
  CEOPlan,
} from "./types";

export class CEOAdvisor {

  advise(
    plan: CEOPlan
  ): string {

    return `Objetivo estratégico: ${plan.objective}`;

  }

}

export const ceoAdvisor =
  new CEOAdvisor();