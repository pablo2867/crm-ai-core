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

      .from("reminders")

      .update({

        completed: true,

      })

      .eq(
        "id",
        body.id
      );

    return NextResponse.json({

      success: true,

    });

  } catch (error) {

    console.log(
      "COMPLETE REMINDER ERROR:",
      error
    );

    return NextResponse.json({

      success: false,

    });

  }

}