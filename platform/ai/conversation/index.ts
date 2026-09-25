export * from "./types";

export * from "./builder";

export * from "./runtime";
export * from "./decision";
export * from "./response";
export * from "./whatsapp-auto-reply";

export * from "./workflow-bridge";

export {
  commercialConversationIntelligence,
  CommercialConversationIntelligence,
} from "./commercial-intelligence";

export type {
  CommercialConversationData,
  CommercialIntelligenceRequest,
  CommercialIntelligenceResult,
} from "./commercial-intelligence";

export {
  deriveOpportunityState,
} from "./opportunity-state";

export type {
  OpportunityState,
  OpportunityStage,
  InterestLevel,
} from "./opportunity-state";

export {
  analyzeObjections,
} from "./objection-intelligence";

export type {
  CommercialObjection,
  ObjectionIntelligenceResult,
  ObjectionType,
} from "./objection-intelligence";

export {
  resolveObjectionStrategy,
} from "./objection-strategy";

export type {
  ObjectionStrategy,
  ObjectionStrategyType,
} from "./objection-strategy";

export {
  generateObjectionResponse,
} from "./objection-response";

export type {
  ObjectionResponse,
} from "./objection-response";

export {
  analyzeQualification,
} from "./qualification-intelligence";

export type {
  QualificationIntelligence,
  QualificationLevel,
} from "./qualification-intelligence";

export {
  commercialProposalEngine,
  CommercialProposalEngine,
} from "./commercial-proposal";

export type {
  CommercialProposalRequest,
  CommercialProposalResult,
} from "./commercial-proposal";
