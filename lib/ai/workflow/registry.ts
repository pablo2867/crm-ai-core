import { WorkflowRegistry } from "./types";

export const workflowRegistry: WorkflowRegistry = {
  "find-best-lead": {
    id: "find-best-lead",
    name: "Find Best Lead",
    description: "Busca el lead con mayor prioridad.",
    category: "sales",
    enabled: true,
    priority: 60,
    requiredSkills: ["find-best-lead"],
  },

  "create-task": {
    id: "create-task",
    name: "Create Task",
    description: "Genera una tarea de seguimiento.",
    category: "sales",
    enabled: true,
    priority: 80,
    requiredSkills: ["create-task"],
  },

  "generate-followup": {
    id: "generate-followup",
    name: "Generate Follow-up",
    description: "Genera un follow-up para el lead.",
    category: "sales",
    enabled: true,
    priority: 95,
    requiredSkills: ["generate-followup"],
  },
};

export function getWorkflow(id: string) {
  return workflowRegistry[id];
}

export function getAllWorkflows() {
  return Object.values(workflowRegistry);
}