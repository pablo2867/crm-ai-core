import {
  Permission,
  Permissions,
} from "./permissions";

export enum Role {

  OWNER = "owner",

  ADMIN = "admin",

  MANAGER = "manager",

  SALES = "sales",

  SUPPORT = "support",

  VIEWER = "viewer",

}

export const RolePermissions: Record<
  Role,
  readonly Permission[]
> = {

  [Role.OWNER]: [

    ...Object.values(Permissions),

  ],

  [Role.ADMIN]: [

    Permissions.CRM_LEADS_READ,
    Permissions.CRM_LEADS_CREATE,
    Permissions.CRM_LEADS_UPDATE,

    Permissions.CRM_PIPELINE_READ,
    Permissions.CRM_PIPELINE_UPDATE,

    Permissions.CRM_ANALYTICS_VIEW,

    Permissions.AI_EXECUTE,
    Permissions.AI_MEMORY_VIEW,

    Permissions.TASKS_READ,
    Permissions.TASKS_CREATE,
    Permissions.TASKS_UPDATE,

    Permissions.USERS_VIEW,

    Permissions.ORGANIZATION_VIEW,

    Permissions.WORKSPACE_VIEW,

  ],

  [Role.MANAGER]: [

    Permissions.CRM_LEADS_READ,
    Permissions.CRM_LEADS_CREATE,
    Permissions.CRM_LEADS_UPDATE,

    Permissions.CRM_PIPELINE_READ,
    Permissions.CRM_PIPELINE_UPDATE,

    Permissions.CRM_ANALYTICS_VIEW,

    Permissions.AI_EXECUTE,

    Permissions.TASKS_READ,
    Permissions.TASKS_CREATE,
    Permissions.TASKS_UPDATE,

  ],

  [Role.SALES]: [

    Permissions.CRM_LEADS_READ,
    Permissions.CRM_LEADS_CREATE,
    Permissions.CRM_LEADS_UPDATE,

    Permissions.CRM_PIPELINE_READ,
    Permissions.CRM_PIPELINE_UPDATE,

    Permissions.AI_EXECUTE,

    Permissions.TASKS_READ,
    Permissions.TASKS_CREATE,

  ],

  [Role.SUPPORT]: [

    Permissions.CRM_LEADS_READ,

    Permissions.TASKS_READ,

    Permissions.TASKS_UPDATE,

  ],

  [Role.VIEWER]: [

    Permissions.CRM_LEADS_READ,

    Permissions.CRM_PIPELINE_READ,

    Permissions.CRM_ANALYTICS_VIEW,

  ],

};

export class RoleEngine {

  getPermissions(
    role: Role
  ): readonly Permission[] {

    return RolePermissions[role];

  }

}

export const roleEngine =
  new RoleEngine();