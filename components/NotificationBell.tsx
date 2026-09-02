"use client";

import { Bell } from "lucide-react";

export default function NotificationBell() {

  function enableAudio() {

    const audio = new Audio(
      "/sounds/notification.mp3"
    );

    audio.play();

  }

  return (
    <button
      onClick={enableAudio}
      className="
        relative
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

      <Bell
        className="w-5 h-5"
      />

      <span
        className="
          absolute
          top-2 right-2
          w-3 h-3
          rounded-full
          bg-red-500
          animate-pulse
        "
      />

    </button>
  );
}