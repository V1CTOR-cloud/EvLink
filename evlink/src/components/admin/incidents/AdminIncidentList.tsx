import Link from "next/link";
import { ArrowUpRight, ListFilter, TriangleAlert, Wrench } from "lucide-react";

import { IncidentRow } from "@/components/admin/incidents/IncidentRow";
import { IncidentState } from "@/components/admin/incidents/IncidentState";
import type {
  AdminDashboardIncident,
  AdminDashboardMetrics,
} from "@/services/admin-dashboard";

type IncidentsResult = AdminDashboardMetrics["incidents"];

function sortIncidents(items: AdminDashboardIncident[]) {
  return [...items].sort((a, b) => {
    const priority =
      Number(a.status !== "offline") - Number(b.status !== "offline");

    if (priority !== 0) return priority;

    return Date.parse(b.updatedAt) - Date.parse(a.updatedAt);
  });
}

export function AdminIncidentList({
  incidents,
}: {
  incidents: IncidentsResult;
}) {
  const data = incidents.data;

  const items = data ? sortIncidents(data.items) : [];
  const offlineCount = items.filter((item) => item.status === "offline").length;
  const maintenanceCount = items.filter(
    (item) => item.status === "maintenance",
  ).length;

  return (
    <section aria-labelledby="admin-incidents-title" className="mt-8 space-y-4">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2
              id="admin-incidents-title"
              className="text-base font-semibold tracking-tight"
            >
              Incidencias de red
            </h2>

            {data && data.total > 0 && (
              <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium tabular-nums">
                {data.total.toLocaleString("es-ES")}
              </span>
            )}
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            Elementos que necesitan revisión operativa.
          </p>
        </div>

        <Link
          href="/admin/stations"
          className="group inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Gestionar estaciones
          <ArrowUpRight
            aria-hidden="true"
            className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </Link>
      </header>

      {data === null ? (
        <IncidentState type="error" />
      ) : data.total === 0 ? (
        <IncidentState type="empty" />
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/20 px-4 py-3 sm:px-5">
            <div className="flex items-center gap-2">
              <ListFilter
                aria-hidden="true"
                className="size-4 text-muted-foreground"
              />
              <span className="text-xs font-medium">
                Resumen de incidencias
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <TriangleAlert
                  aria-hidden="true"
                  className="size-3.5 text-destructive"
                />
                Sin conexión
                <span className="font-semibold tabular-nums text-foreground">
                  {offlineCount}
                </span>
              </span>

              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <Wrench
                  aria-hidden="true"
                  className="size-3.5 text-yellow-600"
                />
                Mantenimiento
                <span className="font-semibold tabular-nums text-foreground">
                  {maintenanceCount}
                </span>
              </span>
            </div>
          </div>

          <ul className="space-y-2 p-3 sm:p-4">
            {items.map((incident) => (
              <IncidentRow
                key={`${incident.kind}-${incident.id}`}
                incident={incident}
              />
            ))}
          </ul>

          {data.total > data.items.length && (
            <footer className="border-t border-border bg-muted/20 px-4 py-3 sm:px-5">
              <p className="text-xs leading-relaxed text-muted-foreground">
                Mostrando {data.items.length} de{" "}
                {data.total.toLocaleString("es-ES")} incidencias. Consulta el
                resto desde la gestión de estaciones.
              </p>
            </footer>
          )}
        </div>
      )}
    </section>
  );
}
