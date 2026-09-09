import { NextResponse } from "next/server";

import { authEngine } from "@/platform/auth";

import {
  runtimeHistoryEngine,
} from "@/platform/runtime/history";

export async function GET() {
  try {
    await authEngine.getUser();
    await authEngine.getTenant();

    return NextResponse.json({
      success: true,
      latest: runtimeHistoryEngine.latest(),
      history: runtimeHistoryEngine.all(),
      stats: runtimeHistoryEngine.stats(),
    });
  } catch (error) {
    console.error("[AI Runtime History]", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }
}
