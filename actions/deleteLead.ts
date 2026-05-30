"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function deleteLead(formData: FormData) {

  const id = formData.get("id");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  await supabase
    .from("leads")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  revalidatePath("/leads");
}