import type {
  Capability,
} from "../types";

import type {
  CapabilityContext,
} from "../builder";

export interface CapabilityScoreBreakdown {

  intent: number;

  priority: number;

  context: number;

  total: number;

}

export interface CapabilityScore {

  capability: Capability;

  score: number;

  breakdown: CapabilityScoreBreakdown;

}

export interface ScoreCapabilitiesRequest {

  capabilities: Capability[];

  context: CapabilityContext;

}