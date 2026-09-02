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

    const body =
      await req.json();

    const {

      id,

      name,

      email,

      company,

      phone,

      ai_score,

      ai_temperature,

      deal_value,

    } = body;

    /*
    ---------------------------------------
    Auth + Tenant
    ---------------------------------------
    */

    const user =
      await authEngine.getUser();

    await authEngine.getTenant();

    /*
    ---------------------------------------
    Update Lead
    ---------------------------------------
    */

    await leadRepository.update({

      id,

      userId:
        user.id,

      values: {

        name,

        email,

        company,

        phone,

        ai_score,

        ai_temperature,

        deal_value,

      },

    });

    return NextResponse.json({

      success: true,

    });

  }

  catch (error) {

    console.error(

      "UPDATE LEAD ERROR:",

      error

    );

    return NextResponse.json(

      {

        success: false,

        error:

          error instanceof Error

            ? error.message

            : "No fue posible actualizar el lead.",

      },

      {

        status: 500,

      }

    );

  }

}