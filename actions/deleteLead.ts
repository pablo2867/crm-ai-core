"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function deleteLead(formData: FormData) {

  const id = formData.get("id");

  await supabase
    .from("leads")
    .delete()
    .eq("id", id);

  revalidatePath("/leads");
}