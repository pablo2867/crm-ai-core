import { taskRepository } from "@/platform/repositories/task";

export interface TaskQueryContext {
  userId: string;
  organizationId: string;
  workspaceId: string;
}

export async function getTasks(
  context: TaskQueryContext,
) {
  const {
    userId,
    organizationId,
    workspaceId,
  } = context;

  return taskRepository.list({
    userId,
    organizationId,
    workspaceId,
  });
}

export async function getRecentTasks(
  context: TaskQueryContext,
  limit = 5,
) {
  const tasks = await getTasks(context);

  return tasks.slice(0, limit);
}

export async function getPendingTasks(
  context: TaskQueryContext,
  limit = 3,
) {
  const {
    userId,
    organizationId,
    workspaceId,
  } = context;

  return taskRepository.list({
    userId,
    organizationId,
    workspaceId,
    status: "pending",
    limit,
  });
}
