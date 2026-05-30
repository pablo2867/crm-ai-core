import {
  NextResponse,
} from "next/server";

export async function GET() {

  try {

    // URL BASE

    const baseUrl =
      process.env
        .NEXT_PUBLIC_APP_URL ||

      "http://localhost:3000";

    // EJECUTAR AI STATUS

    const statusResponse =
      await fetch(

        `${baseUrl}/api/ai-status`

      );

    const statusData =
      await statusResponse.json();

    // EJECUTAR AI EXECUTION

    const executionResponse =
      await fetch(

        `${baseUrl}/api/ai-execution`

      );

    const executionData =
      await executionResponse.json();

    // EJECUTAR AUTO FOLLOWUPS

    const followupResponse =
      await fetch(

        `${baseUrl}/api/auto-followups`

      );

    const followupData =
      await followupResponse.json();

    return NextResponse.json({

      success: true,

      cron: {

        aiStatus:
          statusData,

        aiExecution:
          executionData,

        autoFollowups:
          followupData,

      },

      executedAt:
        new Date(),

    });

  } catch (err) {

    console.log(err);

    return NextResponse.json({

      success: false,

    });

  }

}