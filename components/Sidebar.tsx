"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Users,
  BarChart3,
  KanbanSquare,
  Sparkles,
  CheckSquare,
  Briefcase,
} from "lucide-react";

import LogoutButton from "@/components/LogoutButton";

const items = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },

  {
    label: "Leads",
    href: "/leads",
    icon: Users,
  },

  {
    label: "Pipeline",
    href: "/pipeline",
    icon: KanbanSquare,
  },

  {
    label: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },

  {
    label: "Tasks",
    href: "/dashboard/tasks",
    icon: CheckSquare,
  },

  {
    label: "AI Copilot",
    href: "/dashboard/copilot",
    icon: Sparkles,
  },

  {
    label: "Executive",
    href: "/dashboard/executive",
    icon: Briefcase,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="
        fixed
        left-0
        top-0
        h-screen
        w-[280px]
        bg-[#0B0B0F]
        border-r
        border-zinc-800
        p-6
        hidden
        lg:flex
        flex-col
        z-50
        overflow-y-auto
      "
    >
      <div className="mb-10">
        <div
          className="
            w-14
            h-14
            rounded-3xl
            bg-gradient-to-br
            from-blue-500
            to-purple-600
            flex
            items-center
            justify-center
            shadow-2xl
          "
        >
          <Sparkles size={28} />
        </div>

        <h1
          className="
            text-3xl
            font-black
            text-white
            mt-5
          "
        >
          CRM AI
        </h1>

        <p className="text-zinc-500 mt-2">
          Intelligent CRM Platform
        </p>
      </div>

      <nav className="flex flex-col gap-3">
        {items.map((item) => {
          const Icon = item.icon;

          const active =
            pathname === item.href ||
            pathname.startsWith(
              item.href + "/"
            );

          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                active
                  ? `
                    flex
                    items-center
                    gap-4
                    px-5
                    py-4
                    rounded-2xl
                    font-medium
                    bg-white
                    text-black
                    shadow-xl
                    transition-all
                  `
                  : `
                    flex
                    items-center
                    gap-4
                    px-5
                    py-4
                    rounded-2xl
                    font-medium
                    text-zinc-400
                    hover:bg-zinc-900
                    hover:text-white
                    transition-all
                  `
              }
            >
              <Icon size={20} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-6">
        <LogoutButton />
      </div>

      <div
        className="
          mt-6
          rounded-3xl
          bg-gradient-to-br
          from-blue-600
          to-purple-600
          p-5
          shadow-2xl
        "
      >
        <p className="text-sm text-white/80">
          AI Assistant
        </p>

        <h2
          className="
            text-2xl
            font-black
            text-white
            mt-2
          "
        >
          CRM Intelligence
        </h2>

        <p
          className="
            text-white/70
            mt-3
            text-sm
            leading-relaxed
          "
        >
          Analiza leads, automatiza ventas
          y mejora conversiones con IA.
        </p>
      </div>
    </aside>
  );
}
