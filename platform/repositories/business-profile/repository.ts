import { supabaseAdmin } from "@/lib/supabase-admin";

import type {
  BusinessProfileRecord,
  FindBusinessProfileRequest,
  CreateBusinessProfileRequest,
  UpdateBusinessProfileRequest,
} from "./types";

type BusinessProfileRow = {
  id: string;
  user_id: string;
  organization_id: string;
  workspace_id: string;
  business_name: string;
  description: string | null;
  business_type: string | null;
  target_customer: string | null;
  value_proposition: string | null;
  communication_tone: string | null;
  business_hours: unknown;
  policies: unknown;
  commercial_rules: unknown;
  created_at: string;
  updated_at: string;
};

function mapRecord(row: BusinessProfileRow): BusinessProfileRecord {
  return {
    id: row.id,
    userId: row.user_id,
    organizationId: row.organization_id,
    workspaceId: row.workspace_id,
    businessName: row.business_name,
    description: row.description ?? null,
    businessType: row.business_type ?? null,
    targetCustomer: row.target_customer ?? null,
    valueProposition: row.value_proposition ?? null,
    communicationTone: row.communication_tone ?? null,
    businessHours:
      row.business_hours &&
      typeof row.business_hours === "object"
        ? (row.business_hours as Record<string, unknown>)
        : {},
    policies: Array.isArray(row.policies) ? row.policies : [],
    commercialRules: Array.isArray(row.commercial_rules)
      ? row.commercial_rules
      : [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export class BusinessProfileRepository {
  async find(
    request: FindBusinessProfileRequest,
  ): Promise<BusinessProfileRecord | null> {
    const { data, error } = await supabaseAdmin
      .from("business_profiles")
      .select("*")
      .eq("user_id", request.userId)
      .eq("organization_id", request.organizationId)
      .eq("workspace_id", request.workspaceId)
      .maybeSingle();

    if (error) throw new Error(error.message);

    return data ? mapRecord(data as BusinessProfileRow) : null;
  }

  async create(
    request: CreateBusinessProfileRequest,
  ): Promise<BusinessProfileRecord> {
    const { data, error } = await supabaseAdmin
      .from("business_profiles")
      .insert({
        user_id: request.userId,
        organization_id: request.organizationId,
        workspace_id: request.workspaceId,
        business_name: request.businessName,
        description: request.description ?? null,
        business_type: request.businessType ?? null,
        target_customer: request.targetCustomer ?? null,
        value_proposition: request.valueProposition ?? null,
        communication_tone: request.communicationTone ?? null,
        business_hours: request.businessHours ?? {},
        policies: request.policies ?? [],
        commercial_rules: request.commercialRules ?? [],
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    return mapRecord(data as BusinessProfileRow);
  }

  async update(
    request: UpdateBusinessProfileRequest,
  ): Promise<BusinessProfileRecord | null> {
    const values: Record<string, unknown> = {};

    if (request.businessName !== undefined) {
      values.business_name = request.businessName;
    }
    if (request.description !== undefined) {
      values.description = request.description;
    }
    if (request.businessType !== undefined) {
      values.business_type = request.businessType;
    }
    if (request.targetCustomer !== undefined) {
      values.target_customer = request.targetCustomer;
    }
    if (request.valueProposition !== undefined) {
      values.value_proposition = request.valueProposition;
    }
    if (request.communicationTone !== undefined) {
      values.communication_tone = request.communicationTone;
    }
    if (request.businessHours !== undefined) {
      values.business_hours = request.businessHours;
    }
    if (request.policies !== undefined) {
      values.policies = request.policies;
    }
    if (request.commercialRules !== undefined) {
      values.commercial_rules = request.commercialRules;
    }

    const { data, error } = await supabaseAdmin
      .from("business_profiles")
      .update(values)
      .eq("user_id", request.userId)
      .eq("organization_id", request.organizationId)
      .eq("workspace_id", request.workspaceId)
      .select()
      .maybeSingle();

    if (error) throw new Error(error.message);

    return data ? mapRecord(data as BusinessProfileRow) : null;
  }

  async upsert(
    request: CreateBusinessProfileRequest,
  ): Promise<BusinessProfileRecord> {
    const { data, error } = await supabaseAdmin
      .from("business_profiles")
      .upsert(
        {
          user_id: request.userId,
          organization_id: request.organizationId,
          workspace_id: request.workspaceId,
          business_name: request.businessName,
          description: request.description ?? null,
          business_type: request.businessType ?? null,
          target_customer: request.targetCustomer ?? null,
          value_proposition: request.valueProposition ?? null,
          communication_tone: request.communicationTone ?? null,
          business_hours: request.businessHours ?? {},
          policies: request.policies ?? [],
          commercial_rules: request.commercialRules ?? [],
        },
        {
          onConflict: "user_id,organization_id,workspace_id",
        },
      )
      .select()
      .single();

    if (error) throw new Error(error.message);

    return mapRecord(data as BusinessProfileRow);
  }
}

export const businessProfileRepository =
  new BusinessProfileRepository();


