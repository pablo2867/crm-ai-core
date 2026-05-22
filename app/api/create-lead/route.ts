import {
  NextResponse,
} from "next/server";

import {
  supabaseAdmin,
} from "@/lib/supabase-admin";

export async function POST(
  req: Request
) {

  try {

    const body =
      await req.json();

    const {
      name,
      company,
      email,
      phone,
      user_id,
    } = body;

    let ai_score = 60;

    let ai_temperature =
      "WARM";

    let ai_analysis =
      "Lead potencial interesado en información.";

    let ai_followup =
      "Hola, quería darte seguimiento sobre tu interés.";

    const companyText =
      (company || "")
        .toLowerCase();

    const emailText =
      (email || "")
        .toLowerCase();

    const nameText =
      (name || "")
        .toLowerCase();

    // HOT

    if (

      companyText.includes("ceo") ||

      companyText.includes("corp") ||

      companyText.includes("enterprise") ||

      companyText.includes("gym") ||

      companyText.includes("fit") ||

      emailText.includes("@company.com")

    ) {

      ai_score = 92;

      ai_temperature =
        "HOT";

      ai_analysis =
        "Lead de alto valor con perfil empresarial y potencial de cierre rápido.";

      ai_followup =
        "Hola, vi tu interés y quería darte prioridad porque creo que podemos ayudarte rápidamente.";

    }

    // COLD

    if (

      emailText.includes("hotmail") ||

      emailText.includes("test") ||

      nameText.includes("prueba") ||

      !company

    ) {

      ai_score = 40;

      ai_temperature =
        "COLD";

      ai_analysis =
        "Lead con baja intención o poca información empresarial.";

      ai_followup =
        "Hola, seguimos disponibles si en algún momento necesitas más información.";

    }

    // WARM

    if (

      emailText.includes("gmail") ||

      emailText.includes("outlook")

    ) {

      ai_score = 75;

      ai_temperature =
        "WARM";

      ai_analysis =
        "Lead potencial interesado en información sobre servicios o productos.";

      ai_followup =
        "Hola, quería darte seguimiento y saber si aún estás evaluando opciones.";

    }

    const {
      data,
      error,
    } = await supabaseAdmin

      .from("leads")

      .insert([

        {
          name,
          company,
          email,
          phone,

          user_id,

          status: "Nuevo",

          ai_score,

          ai_temperature,

          ai_analysis,

          ai_followup,
        },

      ])

      .select()

      .single();

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
      data,
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