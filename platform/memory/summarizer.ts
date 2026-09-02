import type {
  MemoryRecord,
} from "./types";

export function summarizeMemories(
  memories: MemoryRecord[]
): string {

  if (
    memories.length === 0
  ) {

    return "Sin memoria disponible.";

  }

  return memories

    .map(

      memory =>

        `• ${memory.title}`

    )

    .join("\n");

}
