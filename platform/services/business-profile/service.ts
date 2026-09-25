import {
  businessProfileRepository,
} from "@/platform/repositories/business-profile";

import type {
  BusinessProfileRecord,
} from "@/platform/repositories/business-profile";

import type {
  GetBusinessProfileRequest,
  SaveBusinessProfileRequest,
  EditBusinessProfileRequest,
} from "./types";

export class BusinessProfileService {
  async get(
    request: GetBusinessProfileRequest,
  ): Promise<BusinessProfileRecord | null> {
    return businessProfileRepository.find(request);
  }

  async save(
    request: SaveBusinessProfileRequest,
  ): Promise<BusinessProfileRecord> {
    if (!request.businessName?.trim()) {
      throw new Error("BUSINESS_PROFILE_NAME_REQUIRED");
    }

    return businessProfileRepository.upsert({
      ...request,
      businessName: request.businessName.trim(),
    });
  }

  async update(
    request: EditBusinessProfileRequest,
  ): Promise<BusinessProfileRecord> {
    const existing =
      await businessProfileRepository.find(request);

    if (!existing) {
      throw new Error("BUSINESS_PROFILE_NOT_FOUND");
    }

    if (
      request.businessName !== undefined &&
      !request.businessName.trim()
    ) {
      throw new Error("BUSINESS_PROFILE_NAME_REQUIRED");
    }

    const updated =
      await businessProfileRepository.update({
        ...request,
        businessName:
          request.businessName !== undefined
            ? request.businessName.trim()
            : undefined,
      });

    if (!updated) {
      throw new Error("BUSINESS_PROFILE_UPDATE_FAILED");
    }

    return updated;
  }
}

export const businessProfileService =
  new BusinessProfileService();