import { NextResponse } from "next/server";

import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {

  const body = await req.json();

  const { id, status } = body;

  await supabase
    .from("leads")
    .update({
      status,
    })
    .eq("id", id);

  return NextResponse.json({
    success: true,
  });
}