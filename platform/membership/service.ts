import {
  membershipRepository,
} from "./repository";

import type {
  CreateMembershipRequest,
  FindMembershipRequest,
  Membership,
} from "./types";

export class MembershipService {

  async create(
    request: CreateMembershipRequest
  ): Promise<Membership> {

    return membershipRepository.create(
      request
    );

  }

  async find(
    request: FindMembershipRequest
  ): Promise<Membership | null> {

    return membershipRepository.find(
      request
    );

  }

}

export const membershipService =
  new MembershipService();