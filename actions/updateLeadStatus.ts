"use server";

import {
  createClient,
} from "@/lib/supabase-server";

import {
  revalidatePath,
} from "next/cache";

import { tenantEngine } from "@/platform/tenant";
import { leadRepository } from "@/platform/repositories/lead";

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
  const tenant = await tenantEngine.getTenant(user.id);

  await leadRepository.update({
    id,
    userId: user.id,
    organizationId: tenant.organizationId,
    workspaceId: tenant.workspaceId,
    values: {
      status,
    },
  });

  revalidatePath("/leads");

  revalidatePath("/pipeline");

}