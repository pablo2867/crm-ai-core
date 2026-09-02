import type {
  RuntimeStep,
} from "./types";

import type {
  AIContext,
} from "@/platform/context";

export class RuntimeState {

  /*
  ---------------------------------------
  Estado compartido de la ejecución
  ---------------------------------------
  */

  context?: AIContext;

  memory?: unknown;

  planner?: unknown;

  workflow?: unknown;

  kernel?: unknown;

  response?: unknown;

  /*
  ---------------------------------------
  Pipeline
  ---------------------------------------
  */

  private steps: RuntimeStep[] = [];

  addStep(
    name: string
  ) {

    this.steps.push({

      id:
        crypto.randomUUID(),

      name,

      status:
        "pending",

    });

  }

  startStep(
    name: string
  ) {

    const step =
      this.steps.find(
        s => s.name === name
      );

    if (step) {

      step.status =
        "running";

    }

  }

  completeStep(
    name: string
  ) {

    const step =
      this.steps.find(
        s => s.name === name
      );

    if (step) {

      step.status =
        "completed";

    }

  }

  failStep(
    name: string
  ) {

    const step =
      this.steps.find(
        s => s.name === name
      );

    if (step) {

      step.status =
        "failed";

    }

  }

  getSteps() {

    return this.steps;

  }

}