export interface PricingEngineTenantContext {
  userId: string;
  organizationId: string;
  workspaceId: string;
}

export interface ResolvePricingRequest
  extends PricingEngineTenantContext {
  catalogItemId: string;
  quantity?: number;
}

export interface PricingResolution {
  success: boolean;
  catalogItemId: string;
  pricingId: string | null;
  pricingType: "fixed" | "range" | null;
  quantity: number | null;
  unitPrice: number | null;
  minimumPrice: number | null;
  maximumPrice: number | null;
  subtotal: number | null;
  currency: string | null;
  unit: string | null;
  conditions: string[];
  priceSource: "business_catalog_pricing" | null;
  reason: string | null;
}