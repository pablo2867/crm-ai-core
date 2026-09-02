import {
  goalRegistry,
} from "./registry";

import type {
  BusinessGoal,
  GoalRequest,
} from "./types";

export class GoalResolver {

  resolve(
    request: GoalRequest
  ): BusinessGoal {

    const text =
      request.message.toLowerCase();

    if (

      text.includes("venta") ||

      text.includes("ingreso")

    ) {

      return goalRegistry.find(

        goal =>
          goal.id ===
          "increase_revenue"

      )!;

    }

    if (

      text.includes("empresa") ||

      text.includes("negocio")

    ) {

      return goalRegistry.find(

        goal =>
          goal.id ===
          "analyze_business"

      )!;

    }

    return goalRegistry[0];

  }

}

export const goalResolver =
  new GoalResolver();