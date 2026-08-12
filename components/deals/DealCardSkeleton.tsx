export default function DealCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
      <div className="h-56 animate-pulse bg-white/10" />

      <div className="space-y-4 p-5">
        <div className="h-5 w-3/4 animate-pulse rounded bg-white/10" />

        <div className="h-4 w-1/2 animate-pulse rounded bg-white/10" />

        <div className="h-10 w-full animate-pulse rounded bg-white/10" />
      </div>
    </div>
  );
}