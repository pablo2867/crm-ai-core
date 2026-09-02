export interface ExecutiveBrief {

  title: string;

  summary: string;

  status: "excellent" | "good" | "warning" | "critical";

  score: number;

  highlights: string[];

  priorities: string[];

  risks: string[];

  opportunities: string[];

  nextActions: string[];

}