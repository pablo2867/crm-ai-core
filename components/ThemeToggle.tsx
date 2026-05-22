"use client";

import {
  useEffect,
  useState,
} from "react";

import { useTheme }
from "next-themes";

import {
  Sun,
  Moon,
} from "lucide-react";

export default function ThemeToggle() {

  const {
    theme,
    setTheme,
  } = useTheme();

  const [mounted, setMounted] =
    useState(false);

  useEffect(() => {

    setMounted(true);

  }, []);

  if (!mounted) {

    return null;

  }

  return (
    <button

      onClick={() =>
        setTheme(
          theme === "dark"
            ? "light"
            : "dark"
        )
      }

      className="
        flex items-center justify-center
        w-12 h-12
        rounded-2xl
        bg-white dark:bg-[#111113]
        border border-zinc-200 dark:border-zinc-800
        text-black dark:text-white
        hover:scale-105
        hover:rotate-6
        transition-all duration-300
        shadow-xl
      "

    >

      {
        theme === "dark"
          ? <Sun size={20} />
          : <Moon size={20} />
      }

    </button>
  );
}