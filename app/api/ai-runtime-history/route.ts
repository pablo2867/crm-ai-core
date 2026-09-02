import { NextResponse } from "next/server";

import {
  runtimeHistoryEngine,
} from "@/platform/runtime/history";

export async function GET() {

  try {

    return NextResponse.json({

      success: true,

      latest:
        runtimeHistoryEngine.latest(),

      history:
        runtimeHistoryEngine.all(),

      stats:
        runtimeHistoryEngine.stats(),

    });

  } catch (error) {

    console.error(
      "[AI Runtime History]",
      error
    );

    return NextResponse.json(

      {

        success: false,

        error:
          "No fue posible obtener el historial del Runtime.",

      },

      {

        status: 500,

      }

    );

  }

}