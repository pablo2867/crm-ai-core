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

    console.log(
      "NOTE BODY:",
      body
    );

    const {
      data,
      error,
    } = await supabase

      .from("lead_notes")

      .insert([

        {

          lead_id:
            body.lead_id,

          note:
            body.note,

        },

      ])

      .select();

    console.log(
      "NOTE INSERT:",
      data
    );

    console.log(
      "NOTE ERROR:",
      error
    );

    return NextResponse.json({

      success: !error,

    });

  } catch (error) {

    console.log(
      "NOTE GENERAL ERROR:",
      error
    );

    return NextResponse.json({

      success: false,

    });

  }

}