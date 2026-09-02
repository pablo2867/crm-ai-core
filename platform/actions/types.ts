export type ActionType =
  | "call"
  | "email"
  | "whatsapp"
  | "followup"
  | "meeting"
  | "task";

import type {
  WorkflowResult,
} from "@/platform/workflows";

export interface ActionRequest {

  action: ActionType;

  userId: string;

  organizationId: string;

  workspaceId: string;

  leadId?: number;

  payload?: Record<string, unknown>;

}

export interface ActionResult {

  success: boolean;

  action: ActionType;

  message: string;

  workflow?: WorkflowResult;

}
