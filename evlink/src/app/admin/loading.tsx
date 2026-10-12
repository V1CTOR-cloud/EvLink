import { Skeleton } from "@/components/ui/skeleton";

export default function AdminLoading() {
  return (
    <main
      aria-label="Cargando dashboard administrativo"
      className="p-6 lg:p-8"
    >
      <div className="mx-auto max-w-7xl space-y-6">
        <Skeleton className="h-36 rounded-2xl" />

        <div className="grid gap-3 sm:grid-cols-2">
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div
              key={index}
              className="space-y-4 rounded-xl border bg-card p-4"
            >
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-4 w-44 max-w-full" />
            </div>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Skeleton className="h-72 rounded-xl" />
          <Skeleton className="h-72 rounded-xl" />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Skeleton className="h-64 rounded-xl lg:col-span-2" />
          <Skeleton className="h-64 rounded-xl" />
        </div>

        <Skeleton className="h-48 rounded-xl" />
      </div>
    </main>
  );
}
