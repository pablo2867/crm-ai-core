export interface ExecutiveInsight {

  title: string;

  description: string;

  severity:
    | "info"
    | "warning"
    | "critical";

}

export interface ExecutiveRecommendation {

  title: string;

  description: string;

  priority: number;

}

export interface ExecutiveReport {

  score: number;

  insights: ExecutiveInsight[];

  recommendations:
    ExecutiveRecommendation[];

}