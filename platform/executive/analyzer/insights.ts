import {
  executiveRules,
} from "./rules";

import type {
  BusinessContext,
} from "@/platform/context";

export class ExecutiveInsights {

  generate(
    context: BusinessContext
  ) {

    return executiveRules.evaluate(
      context
    );

  }

}

export const executiveInsights =
  new ExecutiveInsights();