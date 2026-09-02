export interface WorkflowDefinition {
  id: string;
  name: string;
  description: string;
  category: "sales" | "marketing" | "support" | "system";
  enabled: boolean;
  priority: number;
  requiredSkills: string[];
}

export type WorkflowRegistry = Record<string, WorkflowDefinition>;