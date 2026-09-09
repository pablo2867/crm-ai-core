import { Permissions } from "@/platform/auth/permissions";
import { NextResponse } from "next/server";
import { authEngine } from "@/platform/auth";
import { leadRepository } from "@/platform/repositories/lead";

export async function PUT(request: Request) {
  try {
    const user = await authEngine.getUser();
    const tenant = await authEngine.getTenant();

    await authEngine.requirePermission(Permissions.CRM_LEADS_UPDATE);

    const body = await request.json();

    await leadRepository.updateStatus({
      id: body.id,
      userId: user.id,
      organizationId: tenant.organizationId,
      workspaceId: tenant.workspaceId,
      pipelineStage: body.pipelineStage,
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("UPDATE_STATUS_ERROR", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "UPDATE_STATUS_FAILED",
      },
      {
        status: 500,
      },
    );
  }
}

