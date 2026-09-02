export type CampaignChannel =
  | "email"
  | "whatsapp"
  | "sms"
  | "landing"
  | "social"
  | "ads";

export type CampaignStatus =
  | "draft"
  | "planned"
  | "running"
  | "completed"
  | "cancelled";

export interface CampaignAudience {

  id?: string;

  name: string;

  filters?: Record<string, unknown>;

}

export interface CampaignContent {

  subject?: string;

  message?: string;

  landingTitle?: string;

  landingDescription?: string;

  callToAction?: string;

}

export interface CampaignChannelConfig {

  channel: CampaignChannel;

  enabled: boolean;

}

export interface Campaign {

  id: string;

  name: string;

  objective: string;

  status: CampaignStatus;

  audience: CampaignAudience;

  channels: CampaignChannelConfig[];

  content: CampaignContent;

  createdAt: Date;

  updatedAt: Date;

}

export interface CampaignExecutionResult {

  success: boolean;

  campaignId: string;

  executedChannels: CampaignChannel[];

  message: string;

}