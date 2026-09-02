import type {
  CapabilityScore,
} from "../scorer";

export interface CapabilityRanking {

  winner: CapabilityScore;

  ranking: CapabilityScore[];

}