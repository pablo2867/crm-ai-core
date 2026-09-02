import {
  NextResponse,
} from "next/server";

import {
  createClient,
} from "@/lib/supabase-server";

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

    const supabase =
      await createClient();

    const {

      data: { user },

    } =
      await supabase.auth.getUser();

    if (!user) {

      return NextResponse.json(

        {

          success: false,

          error:
            "Unauthorized",

        },

        {

          status: 401,

        }

      );

    }

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