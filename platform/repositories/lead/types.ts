export interface CreateLeadData {
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  userId: string;
  organizationId: string;
  workspaceId: string;
  status: string;
  pipelineStage: string;
  pipelineStageOrder: number;
  aiScore: number;
  aiTemperature: string;
  aiAnalysis: string;
  aiFollowup: string;
  aiAction: string;
  closeProbability: number;
}

export interface UpdateLeadData {
  id: number;
  userId: string;
  organizationId: string;
  workspaceId: string;
  values: Record<string, unknown>;
}

export interface UpdateLeadStatusData {
  id: number;
  userId: string;
  organizationId: string;
  workspaceId: string;
  pipelineStage: string;
}

export interface DeleteLeadData {
  id: number;
  userId: string;
  organizationId: string;
  workspaceId: string;
}

export interface FindLeadData {
  id: number;
  userId: string;
  organizationId: string;
  workspaceId: string;
}

export interface SearchLeadData {
  userId: string;
  organizationId: string;
  workspaceId: string;
  search?: string;
  status?: string;
  pipelineStage?: string;
  aiTemperature?: string;
  minScore?: number;
  maxScore?: number;
  limit?: number;
  offset?: number;
  orderBy?: string;
  ascending?: boolean;
}
