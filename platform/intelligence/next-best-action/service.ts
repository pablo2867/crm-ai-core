import {
  nextBestActionEngine,
} from "./engine";

import type {
  NextBestActionRequest,
} from "./types";

export async function analyzeNextBestAction(
  request: NextBestActionRequest
) {
  return nextBestActionEngine.analyze(
    request
  );
}