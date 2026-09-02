import { supabaseAdmin } from "@/lib/supabase-admin";

import type {
  BillingPlan,
  BillingInterval,
  CreateSubscriptionRequest,
  Subscription,
  SubscriptionStatus,
  UpdateSubscriptionRequest,
} from "./types";

interface SubscriptionRow {
  id: string;
  organization_id: string;
  plan: BillingPlan;
  status: SubscriptionStatus;
  interval: BillingInterval;
  provider: string | null;
  provider_customer_id: string | null;
  provider_subscription_id: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean | null;
  created_at: string;
  updated_at: string;
}

function mapSubscription(
  data: SubscriptionRow
): Subscription {
  return {
    id: data.id,
    organizationId: data.organization_id,
    plan: data.plan,
    status: data.status,
    interval: data.interval,
    provider: data.provider ?? null,
    providerCustomerId:
      data.provider_customer_id ?? null,
    providerSubscriptionId:
      data.provider_subscription_id ?? null,
    currentPeriodStart:
      data.current_period_start
        ? new Date(data.current_period_start)
        : null,
    currentPeriodEnd:
      data.current_period_end
        ? new Date(data.current_period_end)
        : null,
    cancelAtPeriodEnd:
      data.cancel_at_period_end ?? false,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  };
}

export class SubscriptionRepository {
  async create(
    request: CreateSubscriptionRequest
  ): Promise<Subscription> {
    const { data, error } =
      await supabaseAdmin
        .from("subscriptions")
        .insert({
          organization_id:
            request.organizationId,
          plan:
            request.plan ?? "free",
          status:
            request.status ?? "active",
          interval:
            request.interval ?? "month",
          provider:
            request.provider ?? null,
          provider_customer_id:
            request.providerCustomerId ?? null,
          provider_subscription_id:
            request.providerSubscriptionId ?? null,
          current_period_start:
            request.currentPeriodStart?.toISOString() ??
            null,
          current_period_end:
            request.currentPeriodEnd?.toISOString() ??
            null,
          cancel_at_period_end: false,
        })
        .select()
        .single();

    if (error || !data) {
      throw new Error(
        error?.message ??
          "SUBSCRIPTION_CREATE_FAILED"
      );
    }

    return mapSubscription(data);
  }

  async findByOrganizationId(
    organizationId: string
  ): Promise<Subscription | null> {
    const { data, error } =
      await supabaseAdmin
        .from("subscriptions")
        .select("*")
        .eq(
          "organization_id",
          organizationId
        )
        .maybeSingle();

    if (error || !data) {
      return null;
    }

    return mapSubscription(data);
  }

  async update(
    request: UpdateSubscriptionRequest
  ): Promise<Subscription> {
    const updates: Record<string, unknown> = {};

    if (request.plan !== undefined)
      updates.plan = request.plan;

    if (request.status !== undefined)
      updates.status = request.status;

    if (request.interval !== undefined)
      updates.interval = request.interval;

    if (request.provider !== undefined)
      updates.provider = request.provider;

    if (
      request.providerCustomerId !== undefined
    ) {
      updates.provider_customer_id =
        request.providerCustomerId;
    }

    if (
      request.providerSubscriptionId !==
      undefined
    ) {
      updates.provider_subscription_id =
        request.providerSubscriptionId;
    }

    if (
      request.currentPeriodStart !==
      undefined
    ) {
      updates.current_period_start =
        request.currentPeriodStart?.toISOString() ??
        null;
    }

    if (
      request.currentPeriodEnd !== undefined
    ) {
      updates.current_period_end =
        request.currentPeriodEnd?.toISOString() ??
        null;
    }

    if (
      request.cancelAtPeriodEnd !== undefined
    ) {
      updates.cancel_at_period_end =
        request.cancelAtPeriodEnd;
    }

    const { data, error } =
      await supabaseAdmin
        .from("subscriptions")
        .update(updates)
        .eq("id", request.id)
        .select()
        .single();

    if (error || !data) {
      throw new Error(
        error?.message ??
          "SUBSCRIPTION_UPDATE_FAILED"
      );
    }

    return mapSubscription(data);
  }
}

export const subscriptionRepository =
  new SubscriptionRepository();

