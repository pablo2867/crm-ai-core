export type BusinessPricingType = "fixed" | "range";

export interface BusinessPricingTenantContext {
  userId: string;
  organizationId: string;
  workspaceId: string;
}

export interface FindBusinessPricingRequest
  extends BusinessPricingTenantContext {
  id?: string;
  catalogItemId?: string;
  active?: boolean;
}

export interface CreateBusinessPricingRequest
  extends BusinessPricingTenantContext {
  catalogItemId: string;
  pricingType: BusinessPricingType;

  price?: number | null;
  minimumPrice?: number | null;
  maximumPrice?: number | null;

  costPrice?: number | null;
  marginPercentage?: number | null;
  isEstimated?: boolean;

  currency?: string;
  unit?: string | null;
  minimumQuantity?: number | null;
  maximumQuantity?: number | null;
  conditions?: string[];
  active?: boolean;
}

export interface UpdateBusinessPricingRequest
  extends BusinessPricingTenantContext {
  id: string;

  pricingType?: BusinessPricingType;

  price?: number | null;
  minimumPrice?: number | null;
  maximumPrice?: number | null;

  costPrice?: number | null;
  marginPercentage?: number | null;
  isEstimated?: boolean;

  currency?: string;
  unit?: string | null;
  minimumQuantity?: number | null;
  maximumQuantity?: number | null;
  conditions?: string[];
  active?: boolean;
}

export interface BusinessPricingRecord {
  id: string;

  userId: string;
  organizationId: string;
  workspaceId: string;

  catalogItemId: string;

  pricingType: BusinessPricingType;

  price: number | null;
  minimumPrice: number | null;
  maximumPrice: number | null;

  costPrice: number | null;
  marginPercentage: number | null;
  isEstimated: boolean;

  currency: string | null;
  unit: string | null;

  minimumQuantity: number | null;
  maximumQuantity: number | null;

  conditions: string[];

  active: boolean;

  createdAt: string;
  updatedAt: string;
}