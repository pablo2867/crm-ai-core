import type {
  RepairAction,
} from "../types";

export type RepairAdapterType =
  | "runtime"
  | "config"
  | "sql"
  | "code";

export interface RepairAdapterContext {

  issueId: string;

  action: RepairAction;

  userId?: string;

  organizationId?: string;

  workspaceId?: string;

}

export interface RepairAdapterResult {

  success: boolean;

  executed: boolean;

  message: string;

  rollbackAvailable: boolean;

  metadata?: Record<
    string,
    unknown
  >;

}

export interface RepairAdapter {

  type: RepairAdapterType;

  canHandle(
    action: RepairAction
  ): boolean;

  execute(
    context: RepairAdapterContext
  ):
    Promise<RepairAdapterResult>;

}
