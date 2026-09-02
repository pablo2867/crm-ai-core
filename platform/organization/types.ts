export interface Organization {

  id: string;

  name: string;

  slug: string;

  ownerId: string;

  createdAt: Date;

  updatedAt: Date;

}

export interface OrganizationMember {

  organizationId: string;

  userId: string;

  role: string;

  active: boolean;

}

export interface OrganizationContext {

  organization: Organization;

  member: OrganizationMember;

}

export interface CreateOrganizationRequest {

  name: string;

  ownerId: string;

}

export interface FindOrganizationRequest {

  id: string;

}

export interface FindOrganizationBySlugRequest {

  slug: string;

}