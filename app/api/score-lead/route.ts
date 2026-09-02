import {
  NextResponse,
} from "next/server";

import {
  intelligenceEngine,
} from "@/platform/intelligence";

export async function POST(
  req: Request
) {

  try {

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

    return NextResponse.json({

      score: 0,

      temperature: "COLD",

    });

  }

}