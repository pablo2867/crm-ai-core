import type {
  Capability,
} from "./types";

import {
  salesFollowupCapability,
} from "./sales/sales-followup";

import {
  nextBestActionCapability,
} from "./sales/next-best-action";

import {
  commercialProposalCapability,
} from "./commercial/commercial-proposal";

import {
  dailyBriefCapability,
} from "./executive/daily-brief";

import {
  commandCenterCapability,
} from "./executive/command-center";

export const capabilityRegistry: Capability[] = [

  /*
  ---------------------------------------
  Sales
  ---------------------------------------
  */

  salesFollowupCapability,

  nextBestActionCapability,

  commercialProposalCapability,

  /*
  ---------------------------------------
  Executive
  ---------------------------------------
  */

  dailyBriefCapability,

  commandCenterCapability,

];
