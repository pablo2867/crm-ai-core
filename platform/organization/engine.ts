import {
  organizationService,
} from "./service";

import type {
  CreateOrganizationRequest,
  FindOrganizationBySlugRequest,
  FindOrganizationRequest,
  Organization,
} from "./types";

export class OrganizationEngine {

  async create(
    request: CreateOrganizationRequest
  ): Promise<Organization> {

    return organizationService.create(
      request
    );

  }

  async getById(
    request: FindOrganizationRequest
  ): Promise<Organization | null> {

    return organizationService.findById(
      request
    );

  }

  async getBySlug(
    request: FindOrganizationBySlugRequest
  ): Promise<Organization | null> {

    return organizationService.findBySlug(
      request
    );

  }

}

export const organizationEngine =
  new OrganizationEngine();