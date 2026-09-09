import {
  getMemories,
} from "./storage";

import type {
  RecallRequest,
} from "./types";

export async function recallMemories(
  request: RecallRequest
) {

  let memories =
    await getMemories(
      request.userId,
      request.organizationId,
      request.workspaceId
    );

  if (request.type) {

    memories =
      memories.filter(

        memory =>

          memory.type ===
          request.type

      );

  }

  return memories.slice(
    0,
    request.limit ?? 10
  );

}
