export default function SkeletonCard() {

  return (
    <div
      className="
        animate-pulse
        rounded-3xl
        bg-white dark:bg-[#111113]
        border border-zinc-200 dark:border-zinc-800
        p-6
        h-52
      "
    >

      <div className="h-4 w-32 rounded bg-zinc-200 dark:bg-zinc-800 mb-6" />

      <div className="h-16 w-24 rounded bg-zinc-200 dark:bg-zinc-800 mb-6" />

      <div className="h-4 w-48 rounded bg-zinc-200 dark:bg-zinc-800" />

    </div>
  );
}