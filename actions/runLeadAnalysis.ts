"use server";

import {
  analyzeLead,
} from "@/actions/analyzeLead";

export async function runLeadAnalysis(
  formData: FormData
) {

  const name =
    formData.get("name") as string;

  const company =
    formData.get("company") as string;

  const email =
    formData.get("email") as string;

  const result =
    await analyzeLead({

      name,
      company,
      email,

    });

  console.log(result);

}