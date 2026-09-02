"use client";

import { LogOut }
from "lucide-react";

import { useRouter }
from "next/navigation";

import { supabase }
from "@/lib/supabase";

export default function LogoutButton() {

  const router = useRouter();

  async function logout() {

    await supabase.auth.signOut();

    router.push("/login");

    router.refresh();
  }

  return (
    <button
      onClick={logout}
      className="
        flex items-center gap-2
        bg-white dark:bg-[#111113]
        border border-zinc-200 dark:border-zinc-800
        hover:bg-zinc-100 dark:hover:bg-zinc-900
        transition-all duration-300
        rounded-2xl
        px-5 py-3
        text-black dark:text-white
        shadow-xl
        hover:scale-[1.02]
      "
    >

      <LogOut size={18} />

      Logout

    </button>
  );
}