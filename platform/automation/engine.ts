import { AIEvent } from "@/platform/events";

import { AutomationRule } from "./types";

import {
  addHistory,
} from "./history";

import {
  registerSuccess,
  registerError,
} from "./metrics";

export class AutomationEngine {

  private rules: AutomationRule<unknown>[] = [];

  register<T>(
    rule: AutomationRule<T>
  ) {
    this.rules.push(
      rule as unknown as AutomationRule<unknown>
    );
  }

  async execute(
    event: AIEvent
  ) {

    const rules =
      this.rules.filter(
        (rule) =>
          rule.enabled &&
          rule.event === event.type
      );

    for (const rule of rules) {

      const started =
        Date.now();

      try {

        if (
          rule.condition &&
          !rule.condition(event)
        ) {
          continue;
        }

        await rule.action(event);

        const duration =
          Date.now() - started;

        registerSuccess(
          duration
        );

        addHistory({
          id: crypto.randomUUID(),

          rule: rule.name,

          event: event.type,

          status: "SUCCESS",

          duration,

          createdAt:
            new Date(),
        });

      } catch (error) {

        const duration =
          Date.now() - started;

        registerError(
          duration
        );

        addHistory({
          id: crypto.randomUUID(),

          rule: rule.name,

          event: event.type,

          status: "ERROR",

          duration,

          createdAt:
            new Date(),

          error:
            error instanceof Error
              ? error.message
              : "Unknown Error",
        });

        console.error(
          "[AUTOMATION]",
          error
        );

      }

    }

  }

}

export const automationEngine =
  new AutomationEngine();
