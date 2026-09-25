import { config } from "dotenv";

config({ path: ".env.local" });

async function main() {
  const { supabaseAdmin } = await import("../lib/supabase-admin");

  const { data, error } = await supabaseAdmin
    .from("conversations")
    .select("id, user_id, organization_id, workspace_id")
    .eq(
      "user_id",
      "5b44469c-4ad3-40c0-804a-3ae0cc053cd7",
    )
    .eq(
      "organization_id",
      "8bc86409-0d84-4427-b53f-1676021674cf",
    )
    .eq(
      "workspace_id",
      "6db85bca-3688-4eb4-adb8-2e94da18e88e",
    )
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) {
    throw new Error(error.message);
  }

  console.log("");
  console.log("===== E2E CONVERSATIONS =====");
  console.log(JSON.stringify(data, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
