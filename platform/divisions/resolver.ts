import type {
  DivisionDefinition,
} from "./contracts";

import {
  divisionRegistry,
} from "./registry";

export class DivisionResolver {

  resolve(
    intent: string
  ): DivisionDefinition | undefined {

    switch (intent) {

      case "sales.followup":
      case "sales.task":
      case "sales.pipeline":
      case "sales.best-lead":
        return divisionRegistry.get("sales");

      case "growth.marketing":
      case "growth.funnel":
      case "growth.campaign":
      case "growth.nurturing":
      case "growth.content":
        return divisionRegistry.get("growth");

      default:
        return undefined;
    }

  }

}

export const divisionResolver =
  new DivisionResolver();
