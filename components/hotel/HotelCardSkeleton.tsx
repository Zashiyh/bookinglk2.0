export default function HotelCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-black/10 bg-white dark:border-white/10 dark:bg-[#111111]">
      <div className="aspect-[4/3] animate-pulse bg-zinc-200 dark:bg-zinc-800" />

      <div className="space-y-4 p-5">
        <div className="h-4 w-28 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />

        <div className="h-6 w-3/4 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />

        <div className="h-5 w-32 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />

        <div className="flex gap-2">
          <div className="h-8 w-8 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-8 w-8 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-8 w-8 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
        </div>

        <div className="flex justify-between border-t border-zinc-200 pt-4 dark:border-white/10">
          <div className="h-6 w-32 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-10 w-20 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
        </div>
      </div>
    </div>
  );
}