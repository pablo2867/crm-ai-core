import {
  membershipService,
} from "./service";

import type {
  CreateMembershipRequest,
  FindMembershipRequest,
  Membership,
} from "./types";

export class MembershipEngine {

  async create(
    request: CreateMembershipRequest
  ): Promise<Membership> {

    return membershipService.create(
      request
    );

  }

  async get(
    request: FindMembershipRequest
  ): Promise<Membership | null> {

    return membershipService.find(
      request
    );

  }

}

export const membershipEngine =
  new MembershipEngine();