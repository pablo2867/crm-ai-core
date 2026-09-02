import {
  supabaseAdmin,
} from "@/lib/supabase-admin";

export interface TaskQueryContext {

  userId: string;

  organizationId: string;

  workspaceId: string;

}

export async function getTasks(
  context: TaskQueryContext
) {

  const {
    userId,
    organizationId,
    workspaceId,
  } = context;

  const {
    data,
    error,
  } = await supabaseAdmin

    .from("tasks")

    .select("*")

    .eq(
      "user_id",
      userId
    )

    .eq(
      "organization_id",
      organizationId
    )

    .eq(
      "workspace_id",
      workspaceId
    )

    .order(
      "created_at",
      {
        ascending: false,
      }
    );

  if (error) {
    throw error;
  }

  return data ?? [];

}

export async function getRecentTasks(
  context: TaskQueryContext,
  limit = 5
) {

  const tasks =
    await getTasks(
      context
    );

  return tasks.slice(
    0,
    limit
  );

}

export async function getPendingTasks(
  context: TaskQueryContext,
  limit = 3
) {

  const {
    userId,
    organizationId,
    workspaceId,
  } = context;

  const {
    data,
    error,
  } = await supabaseAdmin

    .from("tasks")

    .select("*")

    .eq(
      "user_id",
      userId
    )

    .eq(
      "organization_id",
      organizationId
    )

    .eq(
      "workspace_id",
      workspaceId
    )

    .eq(
      "status",
      "pending"
    )

    .order(
      "created_at",
      {
        ascending: false,
      }
    )

    .limit(limit);

  if (error) {
    throw error;
  }

  return data ?? [];

}
