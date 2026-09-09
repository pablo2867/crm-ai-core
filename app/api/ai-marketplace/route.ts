import {
  NextResponse,
} from "next/server";

import {
  createClient,
} from "@/lib/supabase-server";

import {
  marketplaceService,
} from "@/platform/marketplace";

export async function GET() {

  try {

    const supabase =
      await createClient();

    const {
      data: {
        user,
      },
    } =
      await supabase.auth.getUser();

    if (!user) {

      return NextResponse.json(
        {
          success: false,
          error:
            "Usuario no autenticado.",
        },
        {
          status: 401,
        }
      );

    }

    const catalog =
      marketplaceService
        .getCatalog();

    return NextResponse.json({
      success: true,
      ...catalog,
    });

  } catch (error) {

    console.error(
      "[AI Marketplace]",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "No fue posible cargar el AI Marketplace.",
      },
      {
        status: 500,
      }
    );

  }

}
