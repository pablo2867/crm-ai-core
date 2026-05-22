import {
  NextResponse,
} from "next/server";

import {
  supabaseAdmin,
} from "@/lib/supabase-admin";

export async function GET() {

  try {

    const {
      data,
      error,
    } = await supabaseAdmin

      .from("leads")

      .select(`

        *,

        lead_notes (
          id,
          note,
          created_at
        ),

        activities (
          id,
          type,
          description,
          created_at
        ),

        reminders (
          id,
          title,
          remind_at,
          completed
        )

      `)

      .order(
        "created_at",
        {
          ascending: false,
        }
      );

    if (error) {

      console.log(error);

      return NextResponse.json(
        {
          success: false,
        },
        {
          status: 500,
        }
      );

    }

    return NextResponse.json({

      success: true,

      leads: data || [],

    });

  } catch (err) {

    console.log(err);

    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );

  }

}