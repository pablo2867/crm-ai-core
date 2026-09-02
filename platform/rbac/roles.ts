import {
  Permissions,
} from "./permissions";

import type {
  Role,
  RoleDefinition,
} from "./types";

export const Roles: Record<
  Role,
  RoleDefinition
> = {

  SUPER_ADMIN: {

    role:
      "SUPER_ADMIN",

    permissions: [

      ...Object.values(
        Permissions
      ),

    ],

  },

  ORGANIZATION_ADMIN: {

    role:
      "ORGANIZATION_ADMIN",

    permissions: [

      Permissions.LEADS_READ,
      Permissions.LEADS_WRITE,
      Permissions.LEADS_DELETE,

      Permissions.TASKS_READ,
      Permissions.TASKS_WRITE,
      Permissions.TASKS_DELETE,

      Permissions.ANALYTICS_VIEW,

      Permissions.COPILOT_USE,

      Permissions.SETTINGS_MANAGE,

      Permissions.ORGANIZATION_MANAGE,

      Permissions.WORKSPACE_MANAGE,

      Permissions.USERS_MANAGE,

    ],

  },

  WORKSPACE_ADMIN: {

    role:
      "WORKSPACE_ADMIN",

    permissions: [

      Permissions.LEADS_READ,
      Permissions.LEADS_WRITE,

      Permissions.TASKS_READ,
      Permissions.TASKS_WRITE,

      Permissions.ANALYTICS_VIEW,

      Permissions.COPILOT_USE,

      Permissions.USERS_MANAGE,

    ],

  },

  SALES_MANAGER: {

    role:
      "SALES_MANAGER",

    permissions: [

      Permissions.LEADS_READ,
      Permissions.LEADS_WRITE,

      Permissions.TASKS_READ,
      Permissions.TASKS_WRITE,

      Permissions.ANALYTICS_VIEW,

      Permissions.COPILOT_USE,

    ],

  },

  SALES_AGENT: {

    role:
      "SALES_AGENT",

    permissions: [

      Permissions.LEADS_READ,
      Permissions.LEADS_WRITE,

      Permissions.TASKS_READ,
      Permissions.TASKS_WRITE,

      Permissions.COPILOT_USE,

    ],

  },

  VIEWER: {

    role:
      "VIEWER",

    permissions: [

      Permissions.LEADS_READ,

      Permissions.TASKS_READ,

      Permissions.ANALYTICS_VIEW,

    ],

  },

};