import { Permissions } from "@/platform/auth/permissions";
import {
  NextResponse,
} from "next/server";

import {
  authEngine,
} from "@/platform/auth";

export async function POST(
  req: Request
) {
  try {

    await authEngine.getUser();
    await authEngine.getTenant();
    await authEngine.requirePermission(Permissions.AI_EXECUTE);

    const body =
      await req.json();

    const lead =
      body.lead;

    if (!lead) {
      return NextResponse.json({
        score: 0,
        temperature: "COLD",
      });
    }

    const {
      intelligenceEngine,
    } = await import("@/platform/intelligence");

    const intelligence =
      intelligenceEngine.evaluateLead({
        email:
          lead.email,

        phone:
          lead.phone,

        company:
          lead.company,

        message:
          lead.message,

        status:
          lead.status,

        aiScore:
          lead.ai_score,
      });

    return NextResponse.json({
      score:
        intelligence.score,

      temperature:
        intelligence.temperature,
    });

  } catch (error) {

    console.error(
      "SCORE LEAD:",
      error
    );

    return NextResponse.json(
      {
        score: 0,
        temperature: "COLD",
      },
      {
        status: 500,
      }
    );
  }
}

