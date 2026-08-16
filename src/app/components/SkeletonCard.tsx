export function SkeletonCard() {
  return (
    <div className="border border-border bg-card rounded-lg p-5 animate-pulse">
      <div className="flex items-start justify-between gap-3">
        <div className="h-4 bg-muted rounded w-2/3" />
        <div className="h-4 bg-muted rounded w-16" />
      </div>
      <div className="mt-3 space-y-1.5">
        <div className="h-3 bg-muted rounded w-full" />
        <div className="h-3 bg-muted rounded w-4/5" />
      </div>
      <div className="mt-4 flex items-center gap-2">
        <div className="h-4 bg-muted rounded w-16" />
        <div className="h-3 bg-muted rounded w-24" />
      </div>
    </div>
  );
}
