import type {
  MemoryRecord,
  RememberRequest,
} from "./types";

const memoryStore =
  new Map<
    string,
    MemoryRecord[]
  >();

export async function storeMemory(
  request: RememberRequest
): Promise<void> {

  const current =
    memoryStore.get(
      request.userId
    ) ?? [];

  current.push({

    ...request,

    createdAt:
      new Date().toISOString(),

  });

  memoryStore.set(
    request.userId,
    current
  );

}

export async function getMemories(
  userId: string
): Promise<MemoryRecord[]> {

  return (
    memoryStore.get(
      userId
    ) ?? []
  );

}