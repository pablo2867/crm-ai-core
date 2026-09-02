import { AutomationRule } from "./types";

import {
  leadCreatedRule,
} from "./rules/lead-created";

export const automationRegistry: AutomationRule<unknown>[] = [
  leadCreatedRule as unknown as AutomationRule<unknown>,
];
