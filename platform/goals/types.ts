export type BusinessGoalType =

  | "increase_revenue"
  | "improve_conversion"
  | "reactivate_clients"
  | "grow_pipeline"
  | "analyze_business";

export interface BusinessGoal {

  id: BusinessGoalType;

  title: string;

  description: string;

  priority: number;

}

export interface GoalRequest {

  message: string;

  intent: string;

  context?: Record<string, unknown>;

}