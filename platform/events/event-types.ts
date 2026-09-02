export const Events = {
  LEAD_CREATED: "lead.created",
  LEAD_UPDATED: "lead.updated",
  LEAD_DELETED: "lead.deleted",

  TASK_CREATED: "task.created",
  TASK_COMPLETED: "task.completed",

  AI_ANALYSIS_COMPLETED: "ai.analysis.completed",
  AI_FOLLOWUP_GENERATED: "ai.followup.generated",

  USER_LOGIN: "user.login",
  USER_LOGOUT: "user.logout",
} as const;