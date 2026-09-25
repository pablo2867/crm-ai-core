import { supabaseAdmin } from "@/lib/supabase-admin";

import type {
  BusinessPricingRecord,
  FindBusinessPricingRequest,
  CreateBusinessPricingRequest,
  UpdateBusinessPricingRequest,
} from "./types";

type BusinessPricingRow = {
  id: string;
  user_id: string;
  organization_id: string;
  workspace_id: string;
  catalog_item_id: string;
  pricing_type: BusinessPricingRecord["pricingType"];
  price: number | null;
  minimum_price: number | null;
  maximum_price: number | null;
  cost_price: number | null;
  margin_percentage: number | null;
  is_estimated: boolean;
  currency: string | null;
  unit: string | null;
  minimum_quantity: number | null;
  maximum_quantity: number | null;
  conditions: unknown;
  active: boolean;
  created_at: string;
  updated_at: string;
};

function mapRow(row: BusinessPricingRow): BusinessPricingRecord {
  return {
    id: row.id,
    userId: row.user_id,
    organizationId: row.organization_id,
    workspaceId: row.workspace_id,
    catalogItemId: row.catalog_item_id,
    pricingType: row.pricing_type,
    price: row.price == null ? null : Number(row.price),
    minimumPrice:
      row.minimum_price == null ? null : Number(row.minimum_price),
    maximumPrice:
      row.maximum_price == null ? null : Number(row.maximum_price),
    costPrice: row.cost_price == null ? null : Number(row.cost_price),
    marginPercentage:
      row.margin_percentage == null
        ? null
        : Number(row.margin_percentage),
    isEstimated: Boolean(row.is_estimated),
    currency: row.currency ?? null,
    unit: row.unit ?? null,
    minimumQuantity:
      row.minimum_quantity == null ? null : Number(row.minimum_quantity),
    maximumQuantity:
      row.maximum_quantity == null ? null : Number(row.maximum_quantity),
    conditions: Array.isArray(row.conditions) ? row.conditions : [],
    active: Boolean(row.active),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export class BusinessPricingRepository {
  async find(
    request: FindBusinessPricingRequest,
  ): Promise<BusinessPricingRecord | null> {
    let query = supabaseAdmin
      .from("business_catalog_pricing")
      .select("*")
      .eq("user_id", request.userId)
      .eq("organization_id", request.organizationId)
      .eq("workspace_id", request.workspaceId);

    if (request.id) query = query.eq("id", request.id);
    if (request.catalogItemId) {
      query = query.eq("catalog_item_id", request.catalogItemId);
    }
    if (request.active !== undefined) {
      query = query.eq("active", request.active);
    }

    const { data, error } = await query
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;

    return data ? mapRow(data as BusinessPricingRow) : null;
  }

  async list(
    request: FindBusinessPricingRequest,
  ): Promise<BusinessPricingRecord[]> {
    let query = supabaseAdmin
      .from("business_catalog_pricing")
      .select("*")
      .eq("user_id", request.userId)
      .eq("organization_id", request.organizationId)
      .eq("workspace_id", request.workspaceId);

    if (request.id) query = query.eq("id", request.id);
    if (request.catalogItemId) {
      query = query.eq("catalog_item_id", request.catalogItemId);
    }
    if (request.active !== undefined) {
      query = query.eq("active", request.active);
    }

    const { data, error } = await query
      .order("created_at", { ascending: false });

    if (error) throw error;

    return (data ?? []).map((row) => mapRow(row as BusinessPricingRow));
  }

  async create(
    request: CreateBusinessPricingRequest,
  ): Promise<BusinessPricingRecord> {
    const { data, error } = await supabaseAdmin
      .from("business_catalog_pricing")
      .insert({
        user_id: request.userId,
        organization_id: request.organizationId,
        workspace_id: request.workspaceId,
        catalog_item_id: request.catalogItemId,
        pricing_type: request.pricingType,
        price: request.price ?? null,
        minimum_price: request.minimumPrice ?? null,
        maximum_price: request.maximumPrice ?? null,
        cost_price: request.costPrice ?? null,
        margin_percentage: request.marginPercentage ?? null,
        is_estimated: request.isEstimated ?? false,
        currency: request.currency ?? "MXN",
        unit: request.unit ?? null,
        minimum_quantity: request.minimumQuantity ?? null,
        maximum_quantity: request.maximumQuantity ?? null,
        conditions: request.conditions ?? [],
        active: request.active ?? true,
      })
      .select("*")
      .single();

    if (error) throw error;

    return mapRow(data as BusinessPricingRow);
  }

  async update(
    request: UpdateBusinessPricingRequest,
  ): Promise<BusinessPricingRecord | null> {
    const updates: Record<string, unknown> = {};

    if (request.pricingType !== undefined) updates.pricing_type = request.pricingType;
    if (request.price !== undefined) updates.price = request.price;
    if (request.minimumPrice !== undefined) updates.minimum_price = request.minimumPrice;
    if (request.maximumPrice !== undefined) updates.maximum_price = request.maximumPrice;
    if (request.costPrice !== undefined) updates.cost_price = request.costPrice;
    if (request.marginPercentage !== undefined) updates.margin_percentage = request.marginPercentage;
    if (request.isEstimated !== undefined) updates.is_estimated = request.isEstimated;
    if (request.currency !== undefined) updates.currency = request.currency;
    if (request.unit !== undefined) updates.unit = request.unit;
    if (request.minimumQuantity !== undefined) updates.minimum_quantity = request.minimumQuantity;
    if (request.maximumQuantity !== undefined) updates.maximum_quantity = request.maximumQuantity;
    if (request.conditions !== undefined) updates.conditions = request.conditions;
    if (request.active !== undefined) updates.active = request.active;

    const { data, error } = await supabaseAdmin
      .from("business_catalog_pricing")
      .update(updates)
      .eq("id", request.id)
      .eq("user_id", request.userId)
      .eq("organization_id", request.organizationId)
      .eq("workspace_id", request.workspaceId)
      .select("*")
      .maybeSingle();

    if (error) throw error;

    return data ? mapRow(data as BusinessPricingRow) : null;
  }
}

export const businessPricingRepository =
  new BusinessPricingRepository();
