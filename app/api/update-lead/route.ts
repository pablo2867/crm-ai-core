import {
  NextResponse,
} from "next/server";

import {
  supabase,
} from "@/lib/supabase";

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

    } = body;

    const {
      error,
    } = await supabase

      .from("leads")

      .update({

        name,
        email,
        company,
        phone,

        ai_score,
        ai_temperature,

      })

      .eq("id", id);

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