export interface TrackCommercialEventRequest {
  userId: string;
  organizationId: string;
  workspaceId: string;
  eventName: string;
  eventData?: Record<string, unknown>;
}