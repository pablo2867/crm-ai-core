import {
  NextResponse,
} from "next/server";

import {
  createClient,
} from "@/lib/supabase-server";

import {
  leadRepository,
} from "@/platform/repositories/lead";

export async function GET() {

  const start =
    Date.now();

  try {

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

    const data =
      await leadRepository.search({

        userId:
          user.id,

      });

    console.log(

      "LEADS_API:",

      `${Date.now() - start}ms`

    );

    return NextResponse.json({

      success: true,

      leads:
        data,

    });

  }

  catch (error) {

    console.error(

      "LEADS API ERROR:",

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