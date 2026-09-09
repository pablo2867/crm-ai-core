import {
  Role,
  RolePermissions,
} from "@/platform/auth/roles";

import type {
  Permission,
  RoleDefinition,
} from "./types";

export const Roles: Record<Role, RoleDefinition> = {

  [Role.OWNER]: {
    role: Role.OWNER,
    permissions: RolePermissions[Role.OWNER],
  },

  [Role.ADMIN]: {
    role: Role.ADMIN,
    permissions: RolePermissions[Role.ADMIN],
  },

  [Role.MANAGER]: {
    role: Role.MANAGER,
    permissions: RolePermissions[Role.MANAGER],
  },

  [Role.SALES]: {
    role: Role.SALES,
    permissions: RolePermissions[Role.SALES],
  },

  [Role.SUPPORT]: {
    role: Role.SUPPORT,
    permissions: RolePermissions[Role.SUPPORT],
  },

  [Role.VIEWER]: {
    role: Role.VIEWER,
    permissions: RolePermissions[Role.VIEWER],
  },

};
