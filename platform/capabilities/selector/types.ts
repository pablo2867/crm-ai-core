import type {
  Capability,
} from "../types";

import type {
  CapabilityContext,
} from "../builder";

import type {
  CapabilityRanking,
} from "../ranker";

export interface CapabilitySelectionRequest {

  capabilities: Capability[];

  context: CapabilityContext;

}

export interface CapabilitySelectionResult {

  capability: Capability;

  ranking: CapabilityRanking;

  context: CapabilityContext;

}