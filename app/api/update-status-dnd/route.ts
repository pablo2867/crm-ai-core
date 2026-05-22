import {
  NextResponse,
} from "next/server";

import {
  createClient,
} from "@supabase/supabase-js";

const supabase =
  createClient(

    process.env
      .NEXT_PUBLIC_SUPABASE_URL!,

    process.env
      .SUPABASE_SERVICE_ROLE_KEY!

  );

export async function POST(
  request: Request
) {

  try {

    const body =
      await request.json();

    await supabase

      .from("leads")

      .update({

        status:
          body.status,

      })

      .eq(
        "id",
        Number(body.id)
      );

    await supabase

      .from("activities")

      .insert([

        {

          lead_id:
            body.id,

          type:
            "status_change",

          description:
            `Lead movido a ${body.status}`,

        },

      ]);

    console.log(
      "DND STATUS:",
      body
    );

    return NextResponse.json({

      success: true,

    });

  } catch (error) {

    console.log(
      "DND GENERAL ERROR:",
      error
    );

    return NextResponse.json({

      success: false,

    });

  }

}