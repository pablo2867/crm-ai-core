import { supabaseAdmin } from "@/lib/supabase-admin";

import { billingEngine } from "@/platform/billing";

import {
  planEnforcementEngine,
} from "@/platform/billing/enforcement";

import type {
  AIUsageRequest,
  AIUsageResult,
} from "./types";

export class AIUsageService {

  async checkFollowup(
    request: AIUsageRequest
  ): Promise<AIUsageResult> {

    const subscription =
      await billingEngine.get(
        request.organizationId
      );

    if (!subscription) {
      return {
        usage: 0,
        allowed: false,
        reason:
          "SUBSCRIPTION_NOT_FOUND",
      };
    }

    const entitlement =
      billingEngine.getEntitlements(
        subscription.plan
      );

    const {
      data: members,
      error: membersError,
    } =
      await supabaseAdmin
        .from("organization_members")
        .select("user_id")
        .eq(
          "organization_id",
          request.organizationId
        )
        .eq(
          "active",
          true
        );

    if (membersError) {
      throw membersError;
    }

    const userIds =
      Array.from(
        new Set(
          (members ?? [])
            .map(
              member =>
                member.user_id
            )
            .filter(
              (
                id
              ): id is string =>
                typeof id === "string" &&
                id.length > 0
            )
        )
      );

    const fallbackUserId =
      request.userId;

    const effectiveUserIds =
      userIds.length > 0
        ? userIds
        : fallbackUserId
          ? [fallbackUserId]
          : [];

    const {
      count,
      error: usageError,
    } =
      await supabaseAdmin
        .from("ai_activity")
        .select(
          "id",
          {
            count: "exact",
            head: true,
          }
        )
        .gte(
          "created_at",
          request.since.toISOString()
        )
        .eq(
          "workflow",
          request.workflow
        )
        .eq(
          "skill",
          request.skill
        )
        .eq(
          "status",
          request.status ?? "success"
        )
        .in(
          "user_id",
          effectiveUserIds
        );

    if (usageError) {
      throw usageError;
    }

    const usage =
      count ?? 0;

    const enforcement =
      planEnforcementEngine.check(
        "ai_followups",
        {
          organizationId:
            request.organizationId,

          entitlement,

          currentUsage:
            usage,
        }
      );

    return {
      usage,

      limit:
        enforcement.limit,

      allowed:
        enforcement.allowed,

      reason:
        enforcement.reason,

      plan:
        subscription.plan,
    };
  }
}

export const aiUsageService =
  new AIUsageService();
