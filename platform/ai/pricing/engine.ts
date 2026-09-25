import {
  businessPricingService,
} from "@/platform/services/business-pricing";

import {
  businessCatalogService,
} from "@/platform/services/business-catalog";

import type {
  ResolvePricingRequest,
  PricingResolution,
} from "./types";

export class PricingEngine {
  async resolve(
    request: ResolvePricingRequest,
  ): Promise<PricingResolution> {
    if (!request.catalogItemId?.trim()) {
      return {
        success: false,
        catalogItemId: request.catalogItemId ?? "",
        pricingId: null,
        pricingType: null,
        quantity: request.quantity ?? null,
        unitPrice: null,
        minimumPrice: null,
        maximumPrice: null,
        subtotal: null,
        currency: null,
        unit: null,
        conditions: [],
        priceSource: null,
        reason: "CATALOG_ITEM_ID_REQUIRED",
      };
    }

    if (
      request.quantity !== undefined &&
      (!Number.isFinite(request.quantity) ||
        request.quantity <= 0)
    ) {
      return {
        success: false,
        catalogItemId: request.catalogItemId,
        pricingId: null,
        pricingType: null,
        quantity: request.quantity,
        unitPrice: null,
        minimumPrice: null,
        maximumPrice: null,
        subtotal: null,
        currency: null,
        unit: null,
        conditions: [],
        priceSource: null,
        reason: "INVALID_QUANTITY",
      };
    }

    const catalogItem =
      await businessCatalogService.get({
        userId: request.userId,
        organizationId: request.organizationId,
        workspaceId: request.workspaceId,
        id: request.catalogItemId,
      });

    if (!catalogItem) {
      return {
        success: false,
        catalogItemId: request.catalogItemId,
        pricingId: null,
        pricingType: null,
        quantity: request.quantity ?? null,
        unitPrice: null,
        minimumPrice: null,
        maximumPrice: null,
        subtotal: null,
        currency: null,
        unit: null,
        conditions: [],
        priceSource: null,
        reason: "PRODUCT_NOT_FOUND",
      };
    }

    if (!catalogItem.available) {
      return {
        success: false,
        catalogItemId: request.catalogItemId,
        pricingId: null,
        pricingType: null,
        quantity: request.quantity ?? null,
        unitPrice: null,
        minimumPrice: null,
        maximumPrice: null,
        subtotal: null,
        currency: null,
        unit: catalogItem.unit,
        conditions: catalogItem.specificRules ?? [],
        priceSource: null,
        reason: "PRODUCT_UNAVAILABLE",
      };
    }

    const pricingRecords =
      await businessPricingService.list({
        userId: request.userId,
        organizationId: request.organizationId,
        workspaceId: request.workspaceId,
        catalogItemId: request.catalogItemId,
        active: true,
      });

    if (pricingRecords.length === 0) {
      return {
        success: false,
        catalogItemId: request.catalogItemId,
        pricingId: null,
        pricingType: null,
        quantity: request.quantity ?? null,
        unitPrice: null,
        minimumPrice: null,
        maximumPrice: null,
        subtotal: null,
        currency: null,
        unit: catalogItem.unit,
        conditions: catalogItem.specificRules ?? [],
        priceSource: null,
        reason: "PRICE_NOT_CONFIGURED",
      };
    }

    let compatiblePricing = pricingRecords;

    if (request.quantity !== undefined) {
      compatiblePricing = pricingRecords.filter((pricing) => {
        const minimumValid =
          pricing.minimumQuantity == null ||
          request.quantity! >= pricing.minimumQuantity;

        const maximumValid =
          pricing.maximumQuantity == null ||
          request.quantity! <= pricing.maximumQuantity;

        return minimumValid && maximumValid;
      });
    }

    if (compatiblePricing.length === 0) {
      return {
        success: false,
        catalogItemId: request.catalogItemId,
        pricingId: null,
        pricingType: null,
        quantity: request.quantity ?? null,
        unitPrice: null,
        minimumPrice: null,
        maximumPrice: null,
        subtotal: null,
        currency: null,
        unit: catalogItem.unit,
        conditions: catalogItem.specificRules ?? [],
        priceSource: null,
        reason: "NO_PRICE_FOR_QUANTITY",
      };
    }

    const pricing = compatiblePricing[0];

    if (pricing.pricingType === "fixed") {
      if (pricing.price == null) {
        return {
          success: false,
          catalogItemId: request.catalogItemId,
          pricingId: pricing.id,
          pricingType: pricing.pricingType,
          quantity: request.quantity ?? null,
          unitPrice: null,
          minimumPrice: null,
          maximumPrice: null,
          subtotal: null,
          currency: pricing.currency,
          unit: pricing.unit ?? catalogItem.unit,
          conditions: pricing.conditions ?? [],
          priceSource: null,
          reason: "INVALID_PRICING_CONFIGURATION",
        };
      }

      const subtotal =
        request.quantity !== undefined
          ? Number(
              (pricing.price * request.quantity).toFixed(2),
            )
          : null;

      return {
        success: true,
        catalogItemId: request.catalogItemId,
        pricingId: pricing.id,
        pricingType: "fixed",
        quantity: request.quantity ?? null,
        unitPrice: pricing.price,
        minimumPrice: null,
        maximumPrice: null,
        subtotal,
        currency: pricing.currency,
        unit: pricing.unit ?? catalogItem.unit,
        conditions: pricing.conditions ?? [],
        priceSource: "business_catalog_pricing",
        reason: null,
      };
    }

    if (
      pricing.pricingType === "range" &&
      pricing.minimumPrice != null &&
      pricing.maximumPrice != null
    ) {
      return {
        success: true,
        catalogItemId: request.catalogItemId,
        pricingId: pricing.id,
        pricingType: "range",
        quantity: request.quantity ?? null,
        unitPrice: null,
        minimumPrice: pricing.minimumPrice,
        maximumPrice: pricing.maximumPrice,
        subtotal: null,
        currency: pricing.currency,
        unit: pricing.unit ?? catalogItem.unit,
        conditions: pricing.conditions ?? [],
        priceSource: "business_catalog_pricing",
        reason: null,
      };
    }

    return {
      success: false,
      catalogItemId: request.catalogItemId,
      pricingId: pricing.id,
      pricingType: pricing.pricingType,
      quantity: request.quantity ?? null,
      unitPrice: null,
      minimumPrice: null,
      maximumPrice: null,
      subtotal: null,
      currency: pricing.currency,
      unit: pricing.unit ?? catalogItem.unit,
      conditions: pricing.conditions ?? [],
      priceSource: null,
      reason: "INVALID_PRICING_CONFIGURATION",
    };
  }
}

export const pricingEngine = new PricingEngine();