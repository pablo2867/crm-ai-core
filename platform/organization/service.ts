import {
  organizationRepository,
} from "./repository";

import type {
  CreateOrganizationRequest,
  FindOrganizationBySlugRequest,
  FindOrganizationRequest,
  Organization,
} from "./types";

export class OrganizationService {

  async create(
    request: CreateOrganizationRequest
  ): Promise<Organization> {

    return organizationRepository.create(
      request
    );

  }

  async findById(
    request: FindOrganizationRequest
  ): Promise<Organization | null> {

    return organizationRepository.findById(
      request
    );

  }

  async findBySlug(
    request: FindOrganizationBySlugRequest
  ): Promise<Organization | null> {

    return organizationRepository.findBySlug(
      request
    );

  }

}

export const organizationService =
  new OrganizationService();