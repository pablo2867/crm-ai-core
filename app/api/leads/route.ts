import { NextResponse } from "next/server";
import { authEngine } from "@/platform/auth";
import { leadRepository } from "@/platform/repositories/lead";

export async function GET() {
  try {
    const user = await authEngine.getUser();
    const tenant = await authEngine.getTenant();

    const leads =
      await leadRepository.search({
        userId: user.id,
        organizationId: tenant.organizationId,
        workspaceId: tenant.workspaceId,
      });

    return NextResponse.json(leads);
  } catch (error) {
    console.error("LEADS_API_ERROR", JSON.stringify(error, Object.getOwnPropertyNames(error)));

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : JSON.stringify(error, Object.getOwnPropertyNames(error)),
      },
      {
        status: 500,
      },
    );
  }
}



