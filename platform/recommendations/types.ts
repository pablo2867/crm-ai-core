export interface Recommendation {

  title: string;

  description: string;

  priority: number;

  action:
    | "call"
    | "email"
    | "whatsapp"
    | "followup"
    | "meeting"
    | "task";

}

export interface RecommendationResult {

  recommendations: Recommendation[];

}