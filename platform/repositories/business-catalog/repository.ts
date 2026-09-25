import { supabaseAdmin } from "@/lib/supabase-admin";

import type {
  BusinessCatalogItemRecord,
  FindBusinessCatalogItemRequest,
  CreateBusinessCatalogItemRequest,
  UpdateBusinessCatalogItemRequest,
} from "./types";

type BusinessCatalogRow = {
  id: string;
  user_id: string;
  organization_id: string;
  workspace_id: string;

  code: string | null;
  name: string;
  description: string | null;
  category: string | null;
  image_url: string | null;

  features: unknown;
  benefits: unknown;
  unit: string | null;
  available: boolean | null;
  specific_rules: unknown;

  created_at: string;
  updated_at: string;
};

function mapRecord(row: BusinessCatalogRow): BusinessCatalogItemRecord {
  return {
    id: row.id,
    userId: row.user_id,
    organizationId: row.organization_id,
    workspaceId: row.workspace_id,

    code: row.code ?? null,
    name: row.name,
    description: row.description ?? null,
    category: row.category ?? null,
    imageUrl: row.image_url ?? null,

    features: Array.isArray(row.features) ? row.features : [],
    benefits: Array.isArray(row.benefits) ? row.benefits : [],
    unit: row.unit ?? null,
    available: row.available ?? true,
    specificRules: Array.isArray(row.specific_rules)
      ? row.specific_rules
      : [],

    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export class BusinessCatalogRepository {
  async find(
    request: FindBusinessCatalogItemRequest,
  ): Promise<BusinessCatalogItemRecord | null> {
    let query = supabaseAdmin
      .from("business_catalog_items")
      .select("*")
      .eq("user_id", request.userId)
      .eq("organization_id", request.organizationId)
      .eq("workspace_id", request.workspaceId);

    if (request.id) {
      query = query.eq("id", request.id);
    }

    if (request.code) {
      query = query.eq("code", request.code);
    }

    if (request.name) {
      query = query.ilike("name", request.name);
    }

    const { data, error } = await query
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return data ? mapRecord(data as BusinessCatalogRow) : null;
  }

  async list(
    request: FindBusinessCatalogItemRequest,
  ): Promise<BusinessCatalogItemRecord[]> {
    let query = supabaseAdmin
      .from("business_catalog_items")
      .select("*")
      .eq("user_id", request.userId)
      .eq("organization_id", request.organizationId)
      .eq("workspace_id", request.workspaceId);

    if (request.id) {
      query = query.eq("id", request.id);
    }

    if (request.code) {
      query = query.eq("code", request.code);
    }

    if (request.name) {
      query = query.ilike("name", request.name);
    }

    const { data, error } = await query
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []).map((row) =>
      mapRecord(row as BusinessCatalogRow),
    );
  }

  async create(
    request: CreateBusinessCatalogItemRequest,
  ): Promise<BusinessCatalogItemRecord> {
    const { data, error } = await supabaseAdmin
      .from("business_catalog_items")
      .insert({
        user_id: request.userId,
        organization_id: request.organizationId,
        workspace_id: request.workspaceId,

        code: request.code ?? null,
        name: request.name,
        description: request.description ?? null,
        category: request.category ?? null,
        image_url: request.imageUrl ?? null,

        features: request.features ?? [],
        benefits: request.benefits ?? [],
        unit: request.unit ?? null,
        available: request.available ?? true,
        specific_rules: request.specificRules ?? [],
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return mapRecord(data as BusinessCatalogRow);
  }

  async update(
    request: UpdateBusinessCatalogItemRequest,
  ): Promise<BusinessCatalogItemRecord | null> {
    if (!request.id) {
      throw new Error("BUSINESS_CATALOG_ITEM_ID_REQUIRED");
    }

    const values: Record<string, unknown> = {};

    if (request.code !== undefined) {
      values.code = request.code;
    }

    if (request.name !== undefined) {
      values.name = request.name;
    }

    if (request.description !== undefined) {
      values.description = request.description;
    }

    if (request.category !== undefined) {
      values.category = request.category;
    }

    if (request.imageUrl !== undefined) {
      values.image_url = request.imageUrl;
    }

    if (request.features !== undefined) {
      values.features = request.features;
    }

    if (request.benefits !== undefined) {
      values.benefits = request.benefits;
    }

    if (request.unit !== undefined) {
      values.unit = request.unit;
    }

    if (request.available !== undefined) {
      values.available = request.available;
    }

    if (request.specificRules !== undefined) {
      values.specific_rules = request.specificRules;
    }

    const { data, error } = await supabaseAdmin
      .from("business_catalog_items")
      .update(values)
      .eq("id", request.id)
      .eq("user_id", request.userId)
      .eq("organization_id", request.organizationId)
      .eq("workspace_id", request.workspaceId)
      .select()
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return data ? mapRecord(data as BusinessCatalogRow) : null;
  }
}

export const businessCatalogRepository =
  new BusinessCatalogRepository();
