import { supabaseAdmin } from "@/lib/supabase-admin";

import type {
  CreateWhatsAppConnectionRequest,
  FindWhatsAppConnectionRequest,
  WhatsAppConnectionRecord,
} from "./types";

function mapConnection(
  row: Record<string, unknown>,
): WhatsAppConnectionRecord {
  return {
    id: String(row.id),
    userId: String(row.user_id),
    organizationId: String(row.organization_id),
    workspaceId: String(row.workspace_id),
    phoneNumber: String(row.phone_number),
    provider: String(row.provider ?? "twilio"),
    active: Boolean(row.active),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

export class WhatsAppConnectionRepository {
  async findByPhone(
    request: FindWhatsAppConnectionRequest,
  ): Promise<WhatsAppConnectionRecord | null> {
    const { data, error } = await supabaseAdmin
      .from("whatsapp_connections")
      .select("*")
      .eq("phone_number", request.phoneNumber)
      .eq("active", true)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return data
      ? mapConnection(data as Record<string, unknown>)
      : null;
  }

  async create(
    request: CreateWhatsAppConnectionRequest,
  ): Promise<WhatsAppConnectionRecord> {
    const { data, error } = await supabaseAdmin
      .from("whatsapp_connections")
      .insert({
        user_id: request.userId,
        organization_id: request.organizationId,
        workspace_id: request.workspaceId,
        phone_number: request.phoneNumber,
        provider: request.provider ?? "twilio",
        active: request.active ?? true,
      })
      .select("*")
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return mapConnection(data as Record<string, unknown>);
  }
}

export const whatsappConnectionRepository =
  new WhatsAppConnectionRepository();
