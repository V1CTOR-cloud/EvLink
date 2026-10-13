import { Skeleton } from "@/components/ui/skeleton";

export default function AdminLoading() {
  return (
    <section
      role="status"
      aria-live="polite"
      aria-label="Cargando sección administrativa"
      className="p-6 lg:p-8"
    >
      <div className="mx-auto max-w-7xl space-y-6">
        <Skeleton className="h-8 w-56 max-w-full" />
        <div className="space-y-4 rounded-xl border bg-card p-4 sm:p-6">
          <Skeleton className="h-10 w-full max-w-sm" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </section>
  );
}
