import type {
  ModuleRoute,
} from "@/platform/modules";

export const crmRoutes: ModuleRoute[] = [

  {
    id: "dashboard",
    path: "/dashboard",
    title: "Dashboard",
  },

  {
    id: "leads",
    path: "/leads",
    title: "Leads",
  },

  {
    id: "pipeline",
    path: "/pipeline",
    title: "Pipeline",
  },

  {
    id: "analytics",
    path: "/analytics",
    title: "Analytics",
  },

  {
    id: "copilot",
    path: "/dashboard/copilot",
    title: "AI Copilot",
  },

  {
    id: "tasks",
    path: "/dashboard/tasks",
    title: "Tasks",
  },

  {
    id: "executive",
    path: "/dashboard/executive",
    title: "Executive",
  },

];