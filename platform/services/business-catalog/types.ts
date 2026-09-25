import type {
  FindBusinessCatalogItemRequest,
  CreateBusinessCatalogItemRequest,
  UpdateBusinessCatalogItemRequest,
} from "@/platform/repositories/business-catalog";

export type GetBusinessCatalogItemRequest =
  FindBusinessCatalogItemRequest;

export type ListBusinessCatalogRequest =
  FindBusinessCatalogItemRequest;

export type CreateBusinessCatalogRequest =
  CreateBusinessCatalogItemRequest;

export type UpdateBusinessCatalogRequest =
  UpdateBusinessCatalogItemRequest;