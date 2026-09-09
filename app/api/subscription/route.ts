import { authEngine } from "@/platform/auth";
import { Permissions } from "@/platform/auth/permissions";
import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { mercadoPagoAdapter } from "@/platform/payment-provider/mercadopago";

const PLAN_CONFIG = {
  starter: {
    name: "CRM AI CORE Starter",
    amount: 19,
  },
  pro: {
    name: "CRM AI CORE Pro",
    amount: 49,
  },
  business: {
    name: "CRM AI CORE Business",
    amount: 99,
  },
} as const;

type PlanId = keyof typeof PLAN_CONFIG;

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    
    await authEngine.requirePermission(Permissions.BILLING_VIEW);
if (!user) {
      return NextResponse.json(
        {
          success: false,
          step: "AUTH",
          error: "UNAUTHORIZED",
        }
,
        { status: 401 }
      );
    }

    const { data: memberships, error: membershipError } =
      await supabaseAdmin
        .from("organization_members")
        .select("*")
        .eq("user_id", user.id);

    if (membershipError) {
      return NextResponse.json({
        success: false,
        step: "MEMBERSHIP_QUERY",
        userId: user.id,
        error: membershipError.message,
      });
    }

    const organizationId =
      memberships?.[0]?.organization_id;

    if (!organizationId) {
      return NextResponse.json({
        success: false,
        step: "MEMBERSHIP",
        userId: user.id,
        memberships,
      });
    }

    const { data: subscriptions, error: subscriptionError } =
      await supabaseAdmin
        .from("subscriptions")
        .select("*")
        .eq("organization_id", organizationId);

    if (subscriptionError) {
      return NextResponse.json({
        success: false,
        step: "SUBSCRIPTION_QUERY",
        userId: user.id,
        organizationId,
        error: subscriptionError.message,
      });
    }

    return NextResponse.json({
      success: true,
      userId: user.id,
      organizationId,
      memberships,
      subscriptions,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        step: "EXCEPTION",
        error:
          error instanceof Error
            ? error.message
            : "UNKNOWN_ERROR",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    
    await authEngine.requirePermission(Permissions.BILLING_MANAGE);
if (!user) {
      return NextResponse.json(
        {
          success: false,
          step: "AUTH",
          error: "UNAUTHORIZED",
        }
,
        { status: 401 }
      );
    }

    const body = await request.json();

    const plan = body?.plan as PlanId;
    const cardTokenId = body?.cardTokenId;
    const configuredTestPayerEmail =
      process.env.MERCADOPAGO_TEST_PAYER_EMAIL?.trim();

    const payerEmail =
      configuredTestPayerEmail ||
      user.email?.trim() ||
      (typeof body?.payerEmail === "string"
        ? body.payerEmail.trim()
        : "");

    if (!plan || !(plan in PLAN_CONFIG)) {
      return NextResponse.json(
        {
          success: false,
          step: "VALIDATION",
          error: "INVALID_PLAN",
        },
        { status: 400 }
      );
    }

    if (
      typeof cardTokenId !== "string" ||
      cardTokenId.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          step: "VALIDATION",
          error: "CARD_TOKEN_REQUIRED",
        },
        { status: 400 }
      );
    }

    if (!payerEmail) {
      return NextResponse.json(
        {
          success: false,
          step: "VALIDATION",
          error: "PAYER_EMAIL_REQUIRED",
        },
        { status: 400 }
      );
    }

    const { data: memberships, error: membershipError } =
      await supabaseAdmin
        .from("organization_members")
        .select("organization_id")
        .eq("user_id", user.id);

    if (membershipError) {
      return NextResponse.json(
        {
          success: false,
          step: "MEMBERSHIP_QUERY",
          error: membershipError.message,
        },
        { status: 500 }
      );
    }

    const organizationId =
      memberships?.[0]?.organization_id;

    if (!organizationId) {
      return NextResponse.json(
        {
          success: false,
          step: "MEMBERSHIP",
          error: "ORGANIZATION_NOT_FOUND",
        },
        { status: 400 }
      );
    }

    const planConfig = PLAN_CONFIG[plan];

    /*
     * The provider plan must already exist in Mercado Pago.
     * We deliberately do not create a provider plan on every checkout.
     *
     * The current test plan created previously can be supplied through
     * environment variables until the commercial plan registry is added.
     */
    const providerPlanId =
      plan === "starter"
        ? process.env.MERCADOPAGO_STARTER_PLAN_ID
        : plan === "pro"
          ? process.env.MERCADOPAGO_PRO_PLAN_ID
          : process.env.MERCADOPAGO_BUSINESS_PLAN_ID;

    if (!providerPlanId) {
      return NextResponse.json(
        {
          success: false,
          step: "PROVIDER_PLAN",
          error: "MERCADOPAGO_PLAN_NOT_CONFIGURED",
          plan,
        },
        { status: 500 }
      );
    }

    const externalReference =
      `crm-ai-core:${organizationId}:${plan}:${Date.now()}`;

    const subscription =
      await mercadoPagoAdapter.createSubscription({
        providerPlanId,
        reason: planConfig.name,
        externalReference,
        payerEmail,
        backUrl:
          process.env.NEXT_PUBLIC_APP_URL ??
          "http://localhost:3000",
        cardTokenId,
      });

    /*
     * At this stage we only create the provider subscription.
     * Billing synchronization will be handled in the next sub-block
     * after webhook lifecycle handling is implemented.
     */
    return NextResponse.json({
      success: true,
      organizationId,
      plan,
      amount: planConfig.amount,
      providerSubscriptionId:
        subscription.providerSubscriptionId,
      status: subscription.status,
      payerEmail: subscription.payerEmail,
      externalReference,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        step: "SUBSCRIPTION_CREATE",
        error:
          error instanceof Error
            ? error.message
            : "UNKNOWN_ERROR",
      },
      { status: 500 }
    );
  }
}




