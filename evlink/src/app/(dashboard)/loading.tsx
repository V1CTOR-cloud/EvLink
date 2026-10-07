export default function Loading() {
  return (
    <main className="p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="h-40 animate-pulse rounded-2xl bg-muted" />

        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-20 animate-pulse bg-card" />
          ))}
        </div>

        <div className="h-56 animate-pulse rounded-xl bg-muted" />

        <div className="grid gap-3 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-52 animate-pulse rounded-xl bg-muted"
            />
          ))}
        </div>
      </div>
    </main>
  );
}
