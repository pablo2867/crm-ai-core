export interface Membership {

  id: string;

  organizationId: string;

  workspaceId: string;

  userId: string;

  role: string;

  active: boolean;

  createdAt: Date;

  updatedAt: Date;

}

export interface CreateMembershipRequest {

  organizationId: string;

  workspaceId: string;

  userId: string;

  role: string;

}

export interface FindMembershipRequest {

  userId: string;

  organizationId?: string;

  workspaceId?: string;

}

export interface MembershipContext {

  membership: Membership;

}