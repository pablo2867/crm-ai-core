import { supabaseAdmin } from "@/lib/supabase-admin";

export interface CommercialEventInput {
  userId: string;
  organizationId: string;
  workspaceId: string;
  eventName: string;
  eventData?: Record<string, unknown>;
}

export interface CommercialEventQuery {
  userId: string;
  organizationId: string;
  workspaceId: string;
}

export interface CommercialEvent {
  id: string;
  user_id: string;
  organization_id: string;
  workspace_id: string;
  event_name: string;
  event_data: Record<string, unknown>;
  created_at: string;
}

export class CommercialEventsRepository {
  async create(input: CommercialEventInput): Promise<CommercialEvent> {
    const supabase = supabaseAdmin;

    const { data, error } = await supabase
      .from("commercial_events")
      .insert({
        user_id: input.userId,
        organization_id: input.organizationId,
        workspace_id: input.workspaceId,
        event_name: input.eventName,
        event_data: input.eventData ?? {},
      })
      .select()
      .single();

    if (error) {
      throw new Error(
        `Failed to create commercial event: ${error.message}`,
      );
    }

    return data as CommercialEvent;
  }

  async findByUser(
    query: CommercialEventQuery,
    limit = 100,
  ): Promise<CommercialEvent[]> {
    const supabase = supabaseAdmin;

    const { data, error } = await supabase
      .from("commercial_events")
      .select("*")
      .eq("user_id", query.userId)
      .eq("organization_id", query.organizationId)
      .eq("workspace_id", query.workspaceId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(
        `Failed to fetch commercial events: ${error.message}`,
      );
    }

    return (data ?? []) as CommercialEvent[];
  }

  async findByEventName(
    query: CommercialEventQuery,
    eventName: string,
    limit = 100,
  ): Promise<CommercialEvent[]> {
    const supabase = supabaseAdmin;

    const { data, error } = await supabase
      .from("commercial_events")
      .select("*")
      .eq("user_id", query.userId)
      .eq("organization_id", query.organizationId)
      .eq("workspace_id", query.workspaceId)
      .eq("event_name", eventName)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(
        `Failed to fetch commercial events by name: ${error.message}`,
      );
    }

    return (data ?? []) as CommercialEvent[];
  }
}

export const commercialEventsRepository =
  new CommercialEventsRepository();
