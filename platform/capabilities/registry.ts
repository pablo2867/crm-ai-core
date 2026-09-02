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

  /*
  ---------------------------------------
  Executive
  ---------------------------------------
  */

  dailyBriefCapability,

  commandCenterCapability,

];