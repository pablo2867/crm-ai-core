import type {
  CollaborationResult,
} from "@/platform/agents/collaboration";

export interface CEORequest {

  userId: string;

  message: string;

}

export interface CEOPlan {

  objective: string;

  priorities: string[];

}

export interface CEOResult {

  success: boolean;

  summary: string;

  priorities: string[];

  collaboration?: CollaborationResult;

}