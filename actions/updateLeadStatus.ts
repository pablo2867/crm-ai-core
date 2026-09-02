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

export async function updateLeadStatus(
  formData: FormData
) {

  const supabase =
    await createClient();

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  if (!user) {

    throw new Error(
      "Unauthorized"
    );

  }

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
    )

    .eq(
      "user_id",
      user.id
    );

  revalidatePath("/leads");

  revalidatePath("/pipeline");

}