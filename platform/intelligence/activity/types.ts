import type {
  LeadActivity,
} from "@/platform/domain/lead/types";

export interface ActivityIntelligence {

  totalActivities: number;

  followups: number;

  emails: number;

  calls: number;

  meetings: number;

  tasks: number;

  notes: number;

  lastActivity?: LeadActivity;

  inactivityDays: number;

  engagementScore: number;

  recommendation: string;

}

export interface ActivityAnalysisRequest {

  activities?: LeadActivity[];

}