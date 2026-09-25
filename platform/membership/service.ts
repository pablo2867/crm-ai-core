import { billingEngine } from "@/platform/billing";
import { planEnforcementEngine } from "@/platform/billing/enforcement";

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
    const subscription =
      await billingEngine.get(
        request.organizationId
      );

    /*
     * El OWNER inicial de onboarding puede
     * crearse antes de existir la suscripción.
     */
    if (subscription) {

      const entitlements =
        billingEngine.getEntitlements(
          subscription.plan
        );

      const currentUsers =
        await membershipRepository.countByOrganization(
          request.organizationId
        );

      const enforcement =
        planEnforcementEngine.check(
          "users",
          {
            organizationId:
              request.organizationId,
            entitlement:
              entitlements,
            currentUsage:
              currentUsers,
          }
        );

      if (!enforcement.allowed) {
        throw new Error(
          enforcement.reason ??
            "USER_LIMIT_REACHED"
        );
      }
    }

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
