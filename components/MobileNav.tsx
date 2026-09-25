"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  KanbanSquare,
  Sparkles,
  MoreHorizontal,
  BarChart3,
  CheckSquare,
  Briefcase,
} from "lucide-react";
import { useState } from "react";

const primaryItems = [
  { label: "Inicio", href: "/dashboard", icon: LayoutDashboard },
  { label: "Leads", href: "/leads", icon: Users },
  { label: "Pipeline", href: "/pipeline", icon: KanbanSquare },
  { label: "IA", href: "/dashboard/copilot", icon: Sparkles },
];

const moreItems = [
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Tasks", href: "/dashboard/tasks", icon: CheckSquare },
  { label: "Executive", href: "/dashboard/executive", icon: Briefcase },
];

export default function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isAppRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/leads") ||
    pathname.startsWith("/pipeline") ||
    pathname.startsWith("/analytics");

  if (!isAppRoute) return null;

  return (
    <>
      {open && (
        <div className="fixed inset-x-0 bottom-[72px] z-[60] mx-3 rounded-2xl border border-zinc-800 bg-[#111113] p-3 shadow-2xl lg:hidden">
          <div className="grid grid-cols-3 gap-2">
            {moreItems.map((item) => {
              const Icon = item.icon;
              const active =
                pathname === item.href ||
                pathname.startsWith(item.href + "/");

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex min-h-16 flex-col items-center justify-center gap-1 rounded-xl px-2 text-xs ${
                    active
                      ? "bg-white text-black"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      <nav
        aria-label="Navegación móvil"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-zinc-800 bg-[#0B0B0F]/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur-lg lg:hidden"
      >
        <div className="mx-auto flex h-[72px] max-w-lg items-center justify-around">
          {primaryItems.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href ||
              pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex min-w-14 flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-xs ${
                  active
                    ? "bg-white text-black"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <Icon size={21} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className={`flex min-w-14 flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-xs ${
              open
                ? "bg-white text-black"
                : "text-zinc-400 hover:text-white"
            }`}
            aria-label="Más opciones"
          >
            <MoreHorizontal size={21} />
            <span>Más</span>
          </button>
        </div>
      </nav>
    </>
  );
}
