import type {
  FindBusinessProfileRequest,
  CreateBusinessProfileRequest,
  UpdateBusinessProfileRequest,
} from "@/platform/repositories/business-profile";

export type GetBusinessProfileRequest =
  FindBusinessProfileRequest;

export type SaveBusinessProfileRequest =
  CreateBusinessProfileRequest;

export type EditBusinessProfileRequest =
  UpdateBusinessProfileRequest;