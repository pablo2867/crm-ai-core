"use server";

import {
  supabaseAdmin,
} from "@/lib/supabase-admin";

import { createClient }
from "@/lib/supabase-server";

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
      formData.get("name") as string;

    const company =
      formData.get("company") as string;

    const email =
      formData.get("email") as string;

    const status =
      formData.get("status") as string;

    const { error } =
      await supabaseAdmin
        .from("leads")
        .insert([
          {
            name,
            company,
            email,
            status,
            user_id: user.id,
          },
        ]);

    if (error) {

      return {
        success: false,
        message:
          error.message,
      };

    }

    revalidatePath("/dashboard");

    revalidatePath("/leads");

    revalidatePath("/pipeline");

    return {
      success: true,
      message:
        "Lead creado correctamente",
    };

  } catch (error) {

    console.log(error);

    return {
      success: false,
      message:
        "Error interno",
    };

  }

}