export type ActivityStatus =
  | "success"
  | "error"
  | "running";

export interface Activity {

  id: string;

  workflow: string;

  skill: string;

  status: ActivityStatus;

  message: string;

  createdAt: Date;

  durationMs?: number;

  data?: unknown;

}