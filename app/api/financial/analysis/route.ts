import { NextRequest, NextResponse } from "next/server";
import { Permissions } from "@/platform/auth/permissions";
import { authEngine } from "@/platform/auth";
import { tenantResolver } from "@/platform/tenant";
import { capabilityEngine } from "@/platform/capabilities";
import { ensureKernel } from "@/platform/kernel/ensure";

export async function POST(req: NextRequest) {
  try {
    ensureKernel();

    const user = await authEngine.getUser();

    await authEngine.requirePermission(
      Permissions.FINANCIAL_ANALYSIS_VIEW,
    );

    const tenantResult = await tenantResolver.resolve({
      userId: user.id,
    });

    if (!tenantResult.success || !tenantResult.tenant) {
      return NextResponse.json(
        {
          success: false,
          message: tenantResult.error ?? "TENANT_NOT_FOUND",
        },
        { status: 404 },
      );
    }

    const body = await req.json();

    const result = await capabilityEngine.execute(
      "financial.analysis",
      {
        userId: user.id,
        organizationId:
          tenantResult.tenant.organizationId,
        workspaceId:
          tenantResult.tenant.workspaceId,
        intent: "financial.analysis",
        goal:
          typeof body.goal === "string"
            ? body.goal
            : typeof body.message === "string"
              ? body.message
              : "Analizar información financiera.",
        input: body.input ?? {},
      },
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error(
      "FINANCIAL ANALYSIS API ERROR:",
      error,
    );

    const message =
      error instanceof Error
        ? error.message
        : String(error);

    const status =
      message === "UNAUTHORIZED"
        ? 401
        : message.includes("FORBIDDEN")
          ? 403
          : 500;

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status },
    );
  }
}
