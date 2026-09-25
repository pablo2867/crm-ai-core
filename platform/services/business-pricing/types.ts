import type {
  BusinessPricingTenantContext,
  FindBusinessPricingRequest as RepositoryFindBusinessPricingRequest,
  CreateBusinessPricingRequest as RepositoryCreateBusinessPricingRequest,
  UpdateBusinessPricingRequest as RepositoryUpdateBusinessPricingRequest,
  BusinessPricingRecord,
} from "@/platform/repositories/business-pricing";

export type {
  BusinessPricingTenantContext,
  BusinessPricingRecord,
};

export type GetBusinessPricingRequest =
  RepositoryFindBusinessPricingRequest;

export type ListBusinessPricingRequest =
  RepositoryFindBusinessPricingRequest;

export type CreateBusinessPricingRequest =
  RepositoryCreateBusinessPricingRequest;

export type UpdateBusinessPricingRequest =
  RepositoryUpdateBusinessPricingRequest;