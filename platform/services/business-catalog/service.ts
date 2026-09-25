import {
  businessCatalogRepository,
} from "@/platform/repositories/business-catalog";

import type {
  BusinessCatalogItemRecord,
} from "@/platform/repositories/business-catalog";

import type {
  GetBusinessCatalogItemRequest,
  ListBusinessCatalogRequest,
  CreateBusinessCatalogRequest,
  UpdateBusinessCatalogRequest,
} from "./types";

export class BusinessCatalogService {
  async get(
    request: GetBusinessCatalogItemRequest,
  ): Promise<BusinessCatalogItemRecord | null> {
    return businessCatalogRepository.find(request);
  }

  async list(
    request: ListBusinessCatalogRequest,
  ): Promise<BusinessCatalogItemRecord[]> {
    return businessCatalogRepository.list(request);
  }

  async create(
    request: CreateBusinessCatalogRequest,
  ): Promise<BusinessCatalogItemRecord> {
    if (!request.name?.trim()) {
      throw new Error("BUSINESS_CATALOG_ITEM_NAME_REQUIRED");
    }

    return businessCatalogRepository.create({
      ...request,
      name: request.name.trim(),
    });
  }

  async update(
    request: UpdateBusinessCatalogRequest,
  ): Promise<BusinessCatalogItemRecord> {
    if (!request.id) {
      throw new Error("BUSINESS_CATALOG_ITEM_ID_REQUIRED");
    }

    if (
      request.name !== undefined &&
      !request.name.trim()
    ) {
      throw new Error("BUSINESS_CATALOG_ITEM_NAME_REQUIRED");
    }

    const updated =
      await businessCatalogRepository.update({
        ...request,
        name:
          request.name !== undefined
            ? request.name.trim()
            : undefined,
      });

    if (!updated) {
      throw new Error("BUSINESS_CATALOG_ITEM_NOT_FOUND");
    }

    return updated;
  }
}

export const businessCatalogService =
  new BusinessCatalogService();