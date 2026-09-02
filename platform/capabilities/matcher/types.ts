import type {
  Capability,
} from "../types";

import type {
  CapabilityContext,
} from "../builder";

export interface CapabilityMatchRequest {

  intent?: string;

  context: CapabilityContext;

  capabilities: Capability[];

}