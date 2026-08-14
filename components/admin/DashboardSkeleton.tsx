export default function DashboardSkeleton() {
  return (
    <main className="min-h-[calc(100vh-5rem)] bg-[#f8f8f6] px-4 py-6 dark:bg-[#080808] sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-[1600px] animate-pulse">
        <div className="mb-8">
          <div className="h-3 w-32 rounded bg-zinc-200 dark:bg-white/10" />

          <div className="mt-4 h-10 w-56 rounded-xl bg-zinc-200 dark:bg-white/10" />

          <div className="mt-3 h-4 w-80 rounded bg-zinc-200 dark:bg-white/10" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="rounded-3xl border border-zinc-200 bg-white p-6 dark:border-white/10 dark:bg-[#111]"
            >
              <div className="h-12 w-12 rounded-2xl bg-zinc-200 dark:bg-white/10" />

              <div className="mt-6 h-4 w-24 rounded bg-zinc-200 dark:bg-white/10" />

              <div className="mt-3 h-9 w-32 rounded bg-zinc-200 dark:bg-white/10" />

              <div className="mt-3 h-3 w-40 rounded bg-zinc-200 dark:bg-white/10" />
            </div>
          ))}
        </div>

        <div className="mt-6">
          <div className="mb-4 h-5 w-40 rounded bg-zinc-200 dark:bg-white/10" />

          <div className="grid gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-24 rounded-3xl bg-zinc-200 dark:bg-white/10"
              />
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="h-96 rounded-3xl bg-zinc-200 dark:bg-white/10" />

          <div className="h-96 rounded-3xl bg-zinc-200 dark:bg-white/10" />
        </div>
      </div>
    </main>
  );
}