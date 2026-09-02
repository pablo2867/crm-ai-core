import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  createClient,
} from "@/lib/supabase-server";

import {
  copilotController,
} from "@/platform/copilot";

import {
  tenantResolver,
} from "@/platform/tenant";

export async function POST(
  req: NextRequest
) {
  try {
    const body =
      await req.json();

    const message =
      body.message ??
      body.question ??
      "";

    const supabase =
      await createClient();

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Usuario no autenticado.",
        },
        {
          status: 401,
        }
      );
    }

    const tenantResult =
      await tenantResolver.resolve({
        userId:
          user.id,
      });

    if (
      !tenantResult.success ||
      !tenantResult.tenant
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            tenantResult.error ??
            "TENANT_NOT_FOUND",
        },
        {
          status: 404,
        }
      );
    }

    const result =
      await copilotController.handle(
        message,
        {
          ...body,

          userId:
            user.id,

          organizationId:
            tenantResult.tenant.organizationId,

          workspaceId:
            tenantResult.tenant.workspaceId,
        }
      );

    return NextResponse.json(
      result
    );

  } catch (error) {
    console.error(
      "AI EXECUTION ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : String(error),
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    module: "ai-execution",
    status: "active",
    message:
      "AI Execution Engine listo.",
  });
}

