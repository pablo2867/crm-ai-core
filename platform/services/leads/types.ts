export interface LeadRecord {
  id: number;

  name: string;

  company?: string | null;

  email?: string | null;

  phone?: string | null;

  userId?: string;

  organizationId?: string;

  workspaceId?: string;

  status?: string;

  pipelineStage?: string;

  pipelineStageOrder?: number;

  aiScore?: number;

  aiTemperature?: string;

  aiAnalysis?: string;

  aiFollowup?: string;

  aiAction?: string;

  closeProbability?: number;

  [key: string]: unknown;
}

export interface CreateLeadRequest {
  name: string;

  company?: string;

  email?: string;

  phone?: string;

  userId: string;

  organizationId: string;

  workspaceId: string;
}

export interface CreateLeadResult {
  data: LeadRecord;

  aiScore: number;

  aiTemperature: string;

  aiAnalysis: string;

  aiFollowup: string;

  aiAction: string;
}

export interface UpdateLeadRequest {
  id: number;

  userId: string;

  values: Record<string, unknown>;
}

export interface ChangePipelineRequest {
  id: number;

  userId: string;

  pipelineStage: string;
}

export interface FindLeadRequest {
  id: number;

  userId: string;
}

export interface SearchLeadRequest {
  userId: string;

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