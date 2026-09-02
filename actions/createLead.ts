"use server";

import {
  supabaseAdmin,
} from "@/lib/supabase-admin";

import {
  createClient,
} from "@/lib/supabase-server";

import {
  revalidatePath,
} from "next/cache";

export async function createLead(
  formData: FormData
) {

  try {

    const supabase =
      await createClient();

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user) {

      return {
        success: false,
        message:
          "No autenticado",
      };

    }

    const name =
      String(
        formData.get("name") || ""
      );

    const company =
      String(
        formData.get("company") || ""
      );

    const email =
      String(
        formData.get("email") || ""
      );

    const status =
      String(
        formData.get("status") || "Nuevo"
      );

    let ai_score = 60;

    if (
      company &&
      company.length > 3
    ) {

      ai_score += 10;

    }

    if (
      email.includes("@gmail")
    ) {

      ai_score += 5;

    }

    if (
      email.includes("@company")
    ) {

      ai_score += 20;

    }

    let ai_temperature =
      "WARM";

    if (
      ai_score >= 85
    ) {

      ai_temperature =
        "HOT";

    } else if (
      ai_score <= 50
    ) {

      ai_temperature =
        "COLD";

    }

    const ai_analysis =
      `Lead potencial en la empresa ${company}, con interés en información general.`;

    const ai_followup =
      `Hola ${name}, seguimos disponibles para ayudarte cuando gustes.`;

    const {
      error,
    } =
      await supabaseAdmin

        .from("leads")

        .insert([

          {

            name,
            company,
            email,
            status,

            user_id:
              user.id,

            ai_score,

            ai_temperature,

            ai_analysis,

            ai_followup,

            ai_probability:
              50,

            ai_priority:
              ai_temperature === "HOT"
                ? "Alta"
                : ai_temperature === "WARM"
                ? "Media"
                : "Baja",

            close_probability:
              50,

            estimated_revenue:
              0,

            deal_value:
              0,

          },

        ]);

    console.log(
      "CREATE LEAD ERROR:",
      error
    );

    if (error) {

      return {

        success: false,

        message:
          error.message,

      };

    }

    revalidatePath(
      "/dashboard"
    );

    revalidatePath(
      "/leads"
    );

    revalidatePath(
      "/pipeline"
    );

    return {

      success: true,

      message:
        "Lead creado correctamente",

    };

  } catch (error) {

    console.log(
      "CREATE LEAD ERROR:",
      error
    );

    return {

      success: false,

      message:
        "Error interno",

    };

  }

}