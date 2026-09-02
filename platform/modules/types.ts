import type {
  Capability,
} from "@/platform/capabilities";

export type ModuleCapability =
  | "ai"
  | "analytics"
  | "auth"
  | "billing"
  | "calendar"
  | "communication"
  | "dashboard"
  | "memory"
  | "notifications"
  | "permissions"
  | "runtime"
  | "skills"
  | "storage"
  | "workflow";

export interface ModuleRoute {

  id: string;

  path: string;

  title: string;

  icon?: string;

}

export interface ModuleEntity {

  id: string;

  name: string;

}

export interface ModuleWorkflow {

  id: string;

  name: string;

}

export interface ModuleSkill {

  id: string;

  name: string;

}

export interface ModulePermission {

  id: string;

  description?: string;

}

export interface PlatformModule {

  id: string;

  name: string;

  version: string;

  description?: string;

  enabled: boolean;

  capabilities: ModuleCapability[];

  routes: ModuleRoute[];

  entities: ModuleEntity[];

  workflows: ModuleWorkflow[];

  skills: ModuleSkill[];

  runtimeCapabilities: Capability[];

  permissions: ModulePermission[];

}