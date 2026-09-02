import type {
  WorkflowScore,
} from "../scorer";

export interface RankedWorkflow {

  rank: number;

  workflow: WorkflowScore["workflow"];

  score: number;

}

export interface DecisionRankingMetadata {

  totalWorkflows: number;

  tied: boolean;

  tiedCount: number;

  confidence: number;

  topScore: number;

}

export interface DecisionRanking {

  winner: RankedWorkflow;

  ranking: RankedWorkflow[];

  metadata: DecisionRankingMetadata;

}