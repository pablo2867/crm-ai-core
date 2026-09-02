export type Role =
  | "SUPER_ADMIN"
  | "ORGANIZATION_ADMIN"
  | "WORKSPACE_ADMIN"
  | "SALES_MANAGER"
  | "SALES_AGENT"
  | "VIEWER";

export type Permission =
  | "leads.read"
  | "leads.write"
  | "leads.delete"
  | "tasks.read"
  | "tasks.write"
  | "tasks.delete"
  | "analytics.view"
  | "copilot.use"
  | "settings.manage"
  | "organization.manage"
  | "workspace.manage"
  | "users.manage";

export interface RoleDefinition {

  role: Role;

  permissions: Permission[];

}

export interface UserPermissions {

  userId: string;

  organizationId: string;

  workspaceId: string;

  role: Role;

  permissions: Permission[];

}

export interface PermissionCheckRequest {

  role: Role;

  permission: Permission;

}