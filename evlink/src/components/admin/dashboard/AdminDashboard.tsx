import { TriangleAlert } from "lucide-react";

import { AdminIncidentList } from "@/components/admin/incidents/AdminIncidentList";
import type { AdminDashboardMetrics } from "@/services/admin-dashboard";

import { AdminDashboardHeader } from "./AdminDashboardHeader";
import { AdminDashboardPriorities } from "./AdminDashboardPriorities";
import { AdminDashboardOverview } from "./AdminDashboardOverview";
import { AdminDashboardOperations } from "./AdminDashboardOperations";
import { AdminDashboardAnalytics } from "./AdminDashboardAnalytics";

type AdminDashboardProps = {
  metrics: AdminDashboardMetrics;
};

export function AdminDashboard({ metrics }: AdminDashboardProps) {
  const errors = [
    metrics.stations.error,
    metrics.connectors.error,
    metrics.sessions.error,
    metrics.users.error,
    metrics.payments.error,
  ].filter((error): error is string => error !== null);

  const incidentCount = metrics.incidents.data?.total ?? null;

  const networkHealth =
    metrics.stations.data === null ||
    metrics.connectors.data === null ||
    metrics.incidents.data === null
      ? {
          label: "Datos insuficientes",
          description: "No se puede confirmar el estado de toda la red.",
          tone: "neutral" as const,
        }
      : incidentCount !== null && incidentCount > 0
        ? {
            label: "Con incidencias",
            description: `${incidentCount} incidencias detectadas en la red.`,
            tone: "warning" as const,
          }
        : {
            label: "Operativa",
            description: "No se detectan incidencias en los datos consultados.",
            tone: "success" as const,
          };

  return (
    <section className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <AdminDashboardHeader
          health={networkHealth}
          stations={metrics.stations.data}
          connectors={metrics.connectors.data}
          incidentCount={incidentCount}
        />

        {errors.length > 0 && (
          <div
            role="alert"
            className="rounded-xl border border-destructive/30 bg-destructive/5 p-4"
          >
            <div className="flex items-start gap-3">
              <TriangleAlert
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0 text-destructive"
              />
              <div>
                <p className="text-sm font-medium">
                  Algunas métricas no están disponibles
                </p>
                <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-muted-foreground">
                  {errors.map((error) => (
                    <li key={error}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        <AdminDashboardPriorities metrics={metrics} />

        <AdminIncidentList incidents={metrics.incidents} />

        <AdminDashboardOverview metrics={metrics} />

        <AdminDashboardOperations metrics={metrics} />

        <AdminDashboardAnalytics metrics={metrics} />
      </div>
    </section>
  );
}
