import {
  NextResponse,
} from "next/server";

import {
  generateEmail,
} from "@/platform/services/email-service";

export async function POST(
  request: Request
) {

  try {

    const {
      lead,
      type,
    } = await request.json();

    const email =
      await generateEmail({

        lead,

        type,

      });

    return NextResponse.json({

      success: true,

      email,

    });

  } catch (error) {

    console.error(
      "EMAIL GENERATOR ERROR:",
      error
    );

    return NextResponse.json({

      success: false,

      email:
        "Error generando email.",

    });

  }

}