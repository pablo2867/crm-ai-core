import {
  NextResponse,
} from "next/server";

export async function GET() {

  return NextResponse.json({

    success: true,

    disabled: true,

    module:
      "auto-reminders",

    message:
      "AUTO REMINDERS DESACTIVADO DURANTE REFACTORIZACION",

  });

}