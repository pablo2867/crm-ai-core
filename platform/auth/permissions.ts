/*
---------------------------------------
CRM AI CORE SaaS
Enterprise Permission Engine
---------------------------------------
*/

export const Permissions = {

  /*
  ---------------------------------------
  CRM
  ---------------------------------------
  */

  CRM_LEADS_READ:
    "crm.leads.read",

  CRM_LEADS_CREATE:
    "crm.leads.create",

  CRM_LEADS_UPDATE:
    "crm.leads.update",

  CRM_LEADS_DELETE:
    "crm.leads.delete",

  CRM_PIPELINE_READ:
    "crm.pipeline.read",

  CRM_PIPELINE_UPDATE:
    "crm.pipeline.update",

  CRM_ANALYTICS_VIEW:
    "crm.analytics.view",

  /*
  ---------------------------------------
  AI
  ---------------------------------------
  */

  AI_EXECUTE:
    "ai.execute",

  AI_CONFIGURE:
    "ai.configure",

  AI_MEMORY_VIEW:
    "ai.memory.view",

  AI_MEMORY_WRITE:
    "ai.memory.write",

  /*
  ---------------------------------------
  Tasks
  ---------------------------------------
  */

  TASKS_READ:
    "tasks.read",

  TASKS_CREATE:
    "tasks.create",

  TASKS_UPDATE:
    "tasks.update",

  TASKS_DELETE:
    "tasks.delete",

  /*
  ---------------------------------------
  Administration
  ---------------------------------------
  */

  USERS_VIEW:
    "users.view",

  USERS_MANAGE:
    "users.manage",

  ORGANIZATION_VIEW:
    "organization.view",

  ORGANIZATION_MANAGE:
    "organization.manage",

  WORKSPACE_VIEW:
    "workspace.view",

  WORKSPACE_MANAGE:
    "workspace.manage",

  /*
  ---------------------------------------
  Billing
  ---------------------------------------
  */

  BILLING_VIEW:
    "billing.view",

  BILLING_MANAGE:
    "billing.manage",

} as const;

export type Permission =

  (typeof Permissions)[keyof typeof Permissions];

export class PermissionEngine {

  has(

    permissions: readonly string[],

    permission: Permission

  ): boolean {

    return permissions.includes(

      permission

    );

  }

  hasAny(

    permissions: readonly string[],

    required: readonly Permission[]

  ): boolean {

    return required.some(

      permission =>

        permissions.includes(permission)

    );

  }

  hasAll(

    permissions: readonly string[],

    required: readonly Permission[]

  ): boolean {

    return required.every(

      permission =>

        permissions.includes(permission)

    );

  }

}

export const permissionEngine =
  new PermissionEngine();