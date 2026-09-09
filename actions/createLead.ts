"use server";

import { leadService } from "@/platform/services/leads";
import { tenantEngine } from "@/platform/tenant";
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
    const tenant = await tenantEngine.getTenant(user.id);

    try {
      await leadService.createLead({
        name,
        company,
        email,
        userId: user.id,
        organizationId: tenant.organizationId,
        workspaceId: tenant.workspaceId,
        status,
      });
    } catch (error) {
      console.log(
        "CREATE LEAD ERROR:",
        error
      );

      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Error interno",
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