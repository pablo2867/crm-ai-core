export interface TaskTenantContext {
  userId: string;
  organizationId: string;
  workspaceId: string;
}

export interface CreateTaskData extends TaskTenantContext {
  leadName: string;
  title: string;
  description?: string;
  priority?: string;
  status?: string;
  dueDate?: string | null;
  completedAt?: string | null;
  assignedTo?: string | null;
  source?: string;
  aiGenerated?: boolean;
  notes?: string | null;
}

export interface FindPendingTaskByLeadData extends TaskTenantContext {
  leadName: string;
}

export interface FindTaskByIdData extends TaskTenantContext {
  id: string | number;
}

export interface ListTasksData extends TaskTenantContext {
  status?: string;
  limit?: number;
  offset?: number;
}

export interface CompleteTaskData extends TaskTenantContext {
  id: string | number;
}

export interface DeleteTaskData extends TaskTenantContext {
  id: string | number;
}
