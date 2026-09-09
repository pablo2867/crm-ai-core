import {
  supabaseAdmin,
} from "@/lib/supabase-admin";

import type {
  CreateTaskData,
  FindPendingTaskByLeadData,
  FindTaskByIdData,
  ListTasksData,
  CompleteTaskData,
  DeleteTaskData,
} from "./types";

export class TaskRepository {

  async create(task: CreateTaskData) {
    const {
      userId,
      organizationId,
      workspaceId,
      leadName,
      title,
      description,
      priority,
      status,
      dueDate,
      completedAt,
      assignedTo,
      source,
      aiGenerated,
      notes,
    } = task;

    const { data, error } = await supabaseAdmin
      .from("tasks")
      .insert({
        user_id: userId,
        organization_id: organizationId,
        workspace_id: workspaceId,
        lead_name: leadName,
        title,
        description: description ?? "",
        priority: priority ?? "MEDIUM",
        status: status ?? "pending",
        due_date: dueDate ?? null,
        completed_at: completedAt ?? null,
        assigned_to: assignedTo ?? null,
        source: source ?? "pipeline",
        ai_generated: aiGenerated ?? false,
        notes: notes ?? null,
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async findPendingByLead(task: FindPendingTaskByLeadData) {
    const {
      userId,
      organizationId,
      workspaceId,
      leadName,
    } = task;

    const { data, error } = await supabaseAdmin
      .from("tasks")
      .select("id")
      .eq("user_id", userId)
      .eq("organization_id", organizationId)
      .eq("workspace_id", workspaceId)
      .eq("lead_name", leadName)
      .eq("status", "pending")
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async findById(task: FindTaskByIdData) {
    const {
      id,
      userId,
      organizationId,
      workspaceId,
    } = task;

    const { data, error } = await supabaseAdmin
      .from("tasks")
      .select("*")
      .eq("id", id)
      .eq("user_id", userId)
      .eq("organization_id", organizationId)
      .eq("workspace_id", workspaceId)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async list(task: ListTasksData) {
    const {
      userId,
      organizationId,
      workspaceId,
      status,
      limit,
      offset,
    } = task;

    let query = supabaseAdmin
      .from("tasks")
      .select("*")
      .eq("user_id", userId)
      .eq("organization_id", organizationId)
      .eq("workspace_id", workspaceId)
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    if (typeof limit === "number") {
      query = query.limit(limit);
    }

    if (typeof offset === "number") {
      const rangeEnd =
        typeof limit === "number"
          ? offset + limit - 1
          : offset + 99;

      query = query.range(offset, rangeEnd);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    return data ?? [];
  }

  async complete(task: CompleteTaskData) {
    const {
      id,
      userId,
      organizationId,
      workspaceId,
    } = task;

    const { data, error } = await supabaseAdmin
      .from("tasks")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", userId)
      .eq("organization_id", organizationId)
      .eq("workspace_id", workspaceId)
      .select()
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async delete(task: DeleteTaskData) {
    const {
      id,
      userId,
      organizationId,
      workspaceId,
    } = task;

    const { data, error } = await supabaseAdmin
      .from("tasks")
      .delete()
      .eq("id", id)
      .eq("user_id", userId)
      .eq("organization_id", organizationId)
      .eq("workspace_id", workspaceId)
      .select()
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }
}

export const taskRepository = new TaskRepository();
