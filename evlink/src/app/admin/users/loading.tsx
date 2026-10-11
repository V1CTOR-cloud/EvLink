export default function AdminUsersLoading() {
  return (
    <section
      aria-label="Cargando usuarios"
      className="space-y-6 p-4 sm:p-6"
    >
      <div className="space-y-2">
        <div className="h-7 w-36 animate-pulse rounded bg-muted motion-reduce:animate-none" />
        <div className="h-4 w-64 max-w-full animate-pulse rounded bg-muted motion-reduce:animate-none" />
      </div>
      <div className="h-9 max-w-md animate-pulse rounded-lg bg-muted motion-reduce:animate-none" />
      <div className="grid gap-3 md:hidden">
        {[0, 1, 2].map((item) => (
          <div
            key={item}
            className="h-28 animate-pulse rounded-xl border border-border bg-card motion-reduce:animate-none"
          />
        ))}
      </div>
      <div className="hidden h-72 animate-pulse rounded-xl border border-border bg-card motion-reduce:animate-none md:block" />
    </section>
  );
}
