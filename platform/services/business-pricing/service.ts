import {
  businessPricingRepository,
} from "@/platform/repositories/business-pricing";

import type {
  BusinessPricingRecord,
} from "@/platform/repositories/business-pricing";

import type {
  GetBusinessPricingRequest,
  ListBusinessPricingRequest,
  CreateBusinessPricingRequest,
  UpdateBusinessPricingRequest,
} from "./types";

export class BusinessPricingService {
  async get(
    request: GetBusinessPricingRequest,
  ): Promise<BusinessPricingRecord | null> {
    return businessPricingRepository.find(request);
  }

  async list(
    request: ListBusinessPricingRequest,
  ): Promise<BusinessPricingRecord[]> {
    return businessPricingRepository.list(request);
  }

  async create(
    request: CreateBusinessPricingRequest,
  ): Promise<BusinessPricingRecord> {
    if (!request.catalogItemId) {
      throw new Error("BUSINESS_PRICING_CATALOG_ITEM_REQUIRED");
    }

    if (
      request.pricingType === "fixed" &&
      (request.price === undefined ||
        request.price === null)
    ) {
      throw new Error("BUSINESS_PRICING_FIXED_PRICE_REQUIRED");
    }

    if (
      request.pricingType === "range" &&
      (request.minimumPrice === undefined ||
        request.minimumPrice === null ||
        request.maximumPrice === undefined ||
        request.maximumPrice === null)
    ) {
      throw new Error("BUSINESS_PRICING_RANGE_REQUIRED");
    }

    if (
      request.price !== undefined &&
      request.price !== null &&
      request.price < 0
    ) {
      throw new Error("BUSINESS_PRICING_INVALID_PRICE");
    }

    if (
      request.minimumPrice !== undefined &&
      request.minimumPrice !== null &&
      request.minimumPrice < 0
    ) {
      throw new Error("BUSINESS_PRICING_INVALID_MINIMUM_PRICE");
    }

    if (
      request.maximumPrice !== undefined &&
      request.maximumPrice !== null &&
      request.maximumPrice < 0
    ) {
      throw new Error("BUSINESS_PRICING_INVALID_MAXIMUM_PRICE");
    }

    if (
      request.pricingType === "range" &&
      request.minimumPrice !== null &&
      request.minimumPrice !== undefined &&
      request.maximumPrice !== null &&
      request.maximumPrice !== undefined &&
      request.minimumPrice > request.maximumPrice
    ) {
      throw new Error("BUSINESS_PRICING_INVALID_RANGE");
    }

    return businessPricingRepository.create(request);
  }

  async update(
    request: UpdateBusinessPricingRequest,
  ): Promise<BusinessPricingRecord> {
    if (!request.id) {
      throw new Error("BUSINESS_PRICING_ID_REQUIRED");
    }

    const existing =
      await businessPricingRepository.find({
        userId: request.userId,
        organizationId: request.organizationId,
        workspaceId: request.workspaceId,
        id: request.id,
      });

    if (!existing) {
      throw new Error("BUSINESS_PRICING_NOT_FOUND");
    }

    const pricingType =
      request.pricingType ?? existing.pricingType;

    const price =
      request.price !== undefined
        ? request.price
        : existing.price;

    const minimumPrice =
      request.minimumPrice !== undefined
        ? request.minimumPrice
        : existing.minimumPrice;

    const maximumPrice =
      request.maximumPrice !== undefined
        ? request.maximumPrice
        : existing.maximumPrice;

    if (
      pricingType === "fixed" &&
      (price === null || price === undefined)
    ) {
      throw new Error("BUSINESS_PRICING_FIXED_PRICE_REQUIRED");
    }

    if (
      pricingType === "range" &&
      (minimumPrice === null ||
        minimumPrice === undefined ||
        maximumPrice === null ||
        maximumPrice === undefined)
    ) {
      throw new Error("BUSINESS_PRICING_RANGE_REQUIRED");
    }

    if (
      pricingType === "range" &&
      minimumPrice !== null &&
      minimumPrice !== undefined &&
      maximumPrice !== null &&
      maximumPrice !== undefined &&
      minimumPrice > maximumPrice
    ) {
      throw new Error("BUSINESS_PRICING_INVALID_RANGE");
    }

    const updated =
      await businessPricingRepository.update(request);

    if (!updated) {
      throw new Error("BUSINESS_PRICING_UPDATE_FAILED");
    }

    return updated;
  }
}

export const businessPricingService =
  new BusinessPricingService();