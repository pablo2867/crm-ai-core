"use server";

import {
  supabaseAdmin,
} from "@/lib/supabase-admin";

import {
  revalidatePath,
} from "next/cache";

export async function updateLeadStatus(
  formData: FormData
) {

  const id =
    Number(
      formData.get("id")
    );

  const status =
    String(
      formData.get("status")
    );

  await supabaseAdmin

    .from("leads")

    .update({
      status,
    })

    .eq(
      "id",
      id
    );

  revalidatePath("/leads");

  revalidatePath("/pipeline");

}