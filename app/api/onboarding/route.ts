import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase-server";

import { organizationEngine } from "@/platform/organization";
import { workspaceEngine } from "@/platform/workspace";
import { membershipEngine } from "@/platform/membership";
import { billingEngine } from "@/platform/billing";
import { commercialEventService } from "@/platform/services/commercial-events";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "UNAUTHORIZED",
        },
        { status: 401 }
      );
    }

    const body = await req.json();

    const organizationName =
      typeof body.organizationName === "string"
        ? body.organizationName.trim()
        : "";

    const workspaceName =
      typeof body.workspaceName === "string"
        ? body.workspaceName.trim()
        : "";

    if (!organizationName || !workspaceName) {
      return NextResponse.json(
        {
          success: false,
          error:
            "El nombre de la empresa y del espacio de trabajo son obligatorios.",
        },
        { status: 400 }
      );
    }

    /*
    ---------------------------------------
    EVITAR DUPLICAR TENANT
    ---------------------------------------
    */

    const existingMembership =
      await membershipEngine.get({
        userId: user.id,
      });

    if (existingMembership) {
      return NextResponse.json({
        success: true,
        organizationId:
          existingMembership.organizationId,
        workspaceId:
          existingMembership.workspaceId,
        membershipId:
          existingMembership.id,
        role:
          existingMembership.role,
        alreadyConfigured: true,
      });
    }

    /*
    ---------------------------------------
    ORGANIZATION
    ---------------------------------------
    */

    const organization =
      await organizationEngine.create({
        name: organizationName,
        ownerId: user.id,
      });

    /*
    ---------------------------------------
    WORKSPACE
    ---------------------------------------
    */

    const workspace =
      await workspaceEngine.create({
        organizationId:
          organization.id,
        name: workspaceName,
      });

    /*
    ---------------------------------------
    MEMBERSHIP OWNER
    ---------------------------------------
    */

    const membership =
      await membershipEngine.create({
        organizationId:
          organization.id,
        workspaceId:
          workspace.id,
        userId:
          user.id,
        role:
          "owner",
      });

    /*
    ---------------------------------------
    SUBSCRIPTION FREE
    ---------------------------------------
    */

    const subscription =
      await billingEngine.create({
        organizationId:
          organization.id,
        plan: "free",
        status: "active",
        interval: "month",
      });

    /*
    ---------------------------------------
    RESPONSE
    ---------------------------------------
    */

    return NextResponse.json({
      success: true,

      organizationId:
        organization.id,

      workspaceId:
        workspace.id,

      membershipId:
        membership.id,

      subscriptionId:
        subscription.id,

      plan:
        subscription.plan,

      role:
        membership.role,

      alreadyConfigured:
        false,
    });

  } catch (error) {
    console.error(
      "ONBOARDING ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "ONBOARDING_FAILED",
      },
      { status: 500 }
    );
  }
}