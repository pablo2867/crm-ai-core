import type {
  ActionType,
} from "./types";

export const actionWorkflowRegistry:
  Partial<
    Record<
      ActionType,
      string
    >
  > = {

  email:
    "sales-email",

  followup:
    "sales-followup",

  task:
    "sales-task",

};
