import type {
  Permission,
} from "./types";

export const Permissions = {

  LEADS_READ:
    "leads.read",

  LEADS_WRITE:
    "leads.write",

  LEADS_DELETE:
    "leads.delete",

  TASKS_READ:
    "tasks.read",

  TASKS_WRITE:
    "tasks.write",

  TASKS_DELETE:
    "tasks.delete",

  ANALYTICS_VIEW:
    "analytics.view",

  COPILOT_USE:
    "copilot.use",

  SETTINGS_MANAGE:
    "settings.manage",

  ORGANIZATION_MANAGE:
    "organization.manage",

  WORKSPACE_MANAGE:
    "workspace.manage",

  USERS_MANAGE:
    "users.manage",

} as const;

export const AllPermissions: Permission[] =
  Object.values(
    Permissions
  );