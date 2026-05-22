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

      .insert([

        {

          lead_id:
            body.lead_id,

          title:
            body.title,

          remind_at:
            body.remind_at,

        },

      ]);

    await supabase

      .from("activities")

      .insert([

        {

          lead_id:
            body.lead_id,

          type:
            "reminder",

          description:
            `Reminder creado: ${body.title}`,

        },

      ]);

    return NextResponse.json({

      success: true,

    });

  } catch (error) {

    console.log(
      "REMINDER ERROR:",
      error
    );

    return NextResponse.json({

      success: false,

    });

  }

}