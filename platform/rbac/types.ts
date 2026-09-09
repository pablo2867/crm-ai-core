import type {
  Role,
  RolePermissions,
} from "@/platform/auth/roles";

import type {
  Permission,
} from "@/platform/auth/permissions";

export type RBACRole = Role;
export type RBACPermission = Permission;

export interface RoleDefinition {

  role: Role;

  permissions: readonly Permission[];

}

export interface UserPermissions {

  userId: string;

  organizationId: string;

  workspaceId: string;

  role: Role;

  permissions: readonly Permission[];

}

export interface PermissionCheckRequest {

  role: Role;

  permission: Permission;

}

export { Role, RolePermissions };
export { Permissions } from "@/platform/auth/permissions";
export type { Permission } from "@/platform/auth/permissions";
