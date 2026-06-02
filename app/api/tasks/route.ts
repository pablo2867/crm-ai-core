import { NextResponse } from "next/server";

import {
  supabaseAdmin,
} from "@/lib/supabase-admin";

export async function POST(
  req: Request
) {

  try {

    const body =
      await req.json();

    const { id } =
      body;

    await supabaseAdmin

      .from("tasks")

      .update({

        status:
          "completed",

      })

      .eq(
        "id",
        id
      );

    return NextResponse.json({

      success: true,

    });

  } catch (error) {

    console.log(error);

    return NextResponse.json({

      success: false,

    });

  }

}

export async function DELETE(
  req: Request
) {

  try {

    const body =
      await req.json();

    const { id } =
      body;

    await supabaseAdmin

      .from("tasks")

      .delete()

      .eq(
        "id",
        id
      );

    return NextResponse.json({

      success: true,

    });

  } catch (error) {

    console.log(error);

    return NextResponse.json({

      success: false,

    });

  }

}