import {
  pricingEngine,
} from "./engine";

import type {
  PricingEngineTenantContext,
  PricingResolution,
} from "./types";

export interface CreateQuotationRequest
  extends PricingEngineTenantContext {
  catalogItemId: string;
  quantity?: number;
  customerName?: string;
  notes?: string;
}

export interface QuotationResult {
  success: boolean;
  catalogItemId: string;
  pricingId: string | null;
  pricingType: "fixed" | "range" | null;

  customerName: string | null;
  quantity: number | null;

  unitPrice: number | null;
  minimumPrice: number | null;
  maximumPrice: number | null;

  subtotal: number | null;

  currency: string | null;
  unit: string | null;

  conditions: string[];

  notes: string | null;

  priceSource:
    | "business_catalog_pricing"
    | null;

  reason: string | null;
}

export class PricingQuotation {

  async create(
    request: CreateQuotationRequest,
  ): Promise<QuotationResult> {

    const resolution: PricingResolution =
      await pricingEngine.resolve({
        userId: request.userId,
        organizationId: request.organizationId,
        workspaceId: request.workspaceId,
        catalogItemId: request.catalogItemId,
        quantity: request.quantity,
      });

    if (!resolution.success) {
      return {
        success: false,

        catalogItemId:
          resolution.catalogItemId,

        pricingId:
          resolution.pricingId,

        pricingType:
          resolution.pricingType,

        customerName:
          request.customerName ?? null,

        quantity:
          resolution.quantity,

        unitPrice:
          resolution.unitPrice,

        minimumPrice:
          resolution.minimumPrice,

        maximumPrice:
          resolution.maximumPrice,

        subtotal:
          null,

        currency:
          resolution.currency,

        unit:
          resolution.unit,

        conditions:
          resolution.conditions,

        notes:
          request.notes ?? null,

        priceSource:
          resolution.priceSource,

        reason:
          resolution.reason,
      };
    }

    /*
     * Un precio de rango no representa un precio final.
     * Por seguridad comercial, no calculamos subtotal
     * usando minimumPrice.
     */
    const subtotal =
      resolution.pricingType === "fixed"
        ? resolution.subtotal
        : null;

    return {
      success: true,

      catalogItemId:
        resolution.catalogItemId,

      pricingId:
        resolution.pricingId,

      pricingType:
        resolution.pricingType,

      customerName:
        request.customerName ?? null,

      quantity:
        resolution.quantity,

      unitPrice:
        resolution.pricingType === "fixed"
          ? resolution.unitPrice
          : null,

      minimumPrice:
        resolution.minimumPrice,

      maximumPrice:
        resolution.maximumPrice,

      subtotal,

      currency:
        resolution.currency,

      unit:
        resolution.unit,

      conditions:
        resolution.conditions,

      notes:
        request.notes ?? null,

      priceSource:
        resolution.priceSource,

      reason:
        null,
    };
  }
}

export const pricingQuotation =
  new PricingQuotation();