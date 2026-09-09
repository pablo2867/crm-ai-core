"use server";

import { leadRepository } from "@/platform/repositories/lead";
import { tenantEngine } from "@/platform/tenant";
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
  const tenant = await tenantEngine.getTenant(user.id);

  await leadRepository.delete({
    id: Number(id),
    userId: user.id,
    organizationId: tenant.organizationId,
    workspaceId: tenant.workspaceId,
  });

  revalidatePath("/leads");
}