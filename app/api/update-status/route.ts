import {
  NextResponse,
} from "next/server";

import {
  authEngine,
} from "@/platform/auth";

import {
  leadRepository,
} from "@/platform/repositories/lead";

export async function POST(
  req: Request
) {

  try {

    console.time(
      "UPDATE_STATUS_TOTAL"
    );

    const body =
      await req.json();

    const {

      id,

      pipeline_stage,

    } = body;

    /*
    ---------------------------------------
    Auth + Tenant
    ---------------------------------------
    */

    console.time(
      "AUTH"
    );

    const user =
      await authEngine.getUser();

    await authEngine.getTenant();

    console.timeEnd(
      "AUTH"
    );

    /*
    ---------------------------------------
    Update Pipeline
    ---------------------------------------
    */

    console.time(
      "DB_UPDATE"
    );

    try {

      await leadRepository.updateStatus({

        id,

        userId:
          user.id,

        pipelineStage:
          pipeline_stage,

      });

      console.timeEnd(
        "DB_UPDATE"
      );

    }

    catch (error) {

      console.timeEnd(
        "DB_UPDATE"
      );

      console.error(
        "UPDATE PIPELINE ERROR:",
        error
      );

      return NextResponse.json(

        {

          success: false,

          error:

            error instanceof Error

              ? error.message

              : "No fue posible actualizar el pipeline.",

        },

        {

          status: 500,

        }

      );

    }

    console.timeEnd(
      "UPDATE_STATUS_TOTAL"
    );

    return NextResponse.json({

      success: true,

    });

  }

  catch (error) {

    console.error(
      "UPDATE PIPELINE ERROR:",
      error
    );

    return NextResponse.json(

      {

        success: false,

        error:

          error instanceof Error

            ? error.message

            : "Error interno del servidor.",

      },

      {

        status: 500,

      }

    );

  }

}