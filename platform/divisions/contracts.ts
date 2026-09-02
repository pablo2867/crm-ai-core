export type DivisionId =
  | "executive"
  | "growth"
  | "sales"
  | "finance"
  | "success"
  | "operations"
  | "knowledge";

export interface DivisionCapability {
  id: string;
  name: string;
  description?: string;
}

export interface DivisionDefinition {
  id: DivisionId;

  name: string;

  description: string;

  capabilities: DivisionCapability[];

  agents: string[];

  workflows: string[];

  skills: string[];
}