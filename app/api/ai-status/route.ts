import {
  NextResponse,
} from "next/server";

export async function GET() {

  return NextResponse.json({

    success: true,

    disabled: true,

    module:
      "ai-status",

    message:
      "AI STATUS DESACTIVADO DURANTE REFACTORIZACION",

  });

}