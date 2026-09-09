import { Permissions } from "@/platform/auth/permissions";
import { NextResponse } from "next/server";
import { authEngine } from "@/platform/auth";
import { leadRepository } from "@/platform/repositories/lead";

export async function POST(request: Request) {
  try {
    const user = await authEngine.getUser();
    const tenant = await authEngine.getTenant();

    await authEngine.requirePermission(Permissions.CRM_LEADS_CREATE);

    const body = await request.json();

    const {
      id,
      name,
      email,
      company,
      phone,
      ai_score,
      ai_temperature,
      deal_value,
    } = body;

    await leadRepository.update({
      id,
      userId: user.id,
      organizationId: tenant.organizationId,
      workspaceId: tenant.workspaceId,
      values: {
        name,
        email,
        company,
        phone,
        ai_score,
        ai_temperature,
        deal_value,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("CREATE_LEAD_UPDATE_ERROR", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "UPDATE_LEAD_FAILED",
      },
      {
        status: 500,
      },
    );
  }
}

