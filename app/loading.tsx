import SkeletonCard from "@/components/SkeletonCard";

export default function Loading() {

  return (
    <main className="min-h-screen bg-white dark:bg-[#09090B] p-8 transition-colors duration-300">

      <div className="animate-pulse">

        <div className="mb-10">

          <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded mb-4" />

          <div className="h-12 w-64 bg-zinc-200 dark:bg-zinc-800 rounded" />

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">

          <SkeletonCard />

          <SkeletonCard />

          <SkeletonCard />

        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          <div className="xl:col-span-2 h-[400px] rounded-3xl bg-zinc-200 dark:bg-zinc-800" />

          <div className="space-y-6">

            <div className="h-[200px] rounded-3xl bg-zinc-200 dark:bg-zinc-800" />

            <div className="h-[200px] rounded-3xl bg-zinc-200 dark:bg-zinc-800" />

          </div>

        </div>

      </div>

    </main>
  );
}