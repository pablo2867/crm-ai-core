"use server";

import { revalidatePath } from "next/cache";

import {
  createClient,
} from "@/lib/supabase-server";

export async function deleteLead(
  formData: FormData
) {
  const id =
    formData.get("id");

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

  const { error } =
    await supabase
      .from("leads")
      .delete()
      .eq("id", id)
      .eq(
        "user_id",
        user.id
      );

  if (error) {
    throw error;
  }

  revalidatePath("/leads");
}