import {
  automationEngine,
} from "./engine";

import {
  automationRegistry,
} from "./registry";

for (const rule of automationRegistry) {
  automationEngine.register(rule);
}

export * from "./engine";
export * from "./registry";
export * from "./types";