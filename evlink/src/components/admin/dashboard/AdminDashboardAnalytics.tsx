import { AdminDashboardCharts } from "@/components/admin/AdminDashboardCharts";
import type { AdminDashboardMetrics } from "@/services/admin-dashboard";

import { SectionHeading } from "./SectionHeading";

type AdminDashboardAnalyticsProps = {
  metrics: AdminDashboardMetrics;
};

export function AdminDashboardAnalytics({
  metrics,
}: AdminDashboardAnalyticsProps) {
  return (
    <section aria-labelledby="admin-analytics-title" className="space-y-4">
      <SectionHeading
        id="admin-analytics-title"
        eyebrow="Analítica"
        title="Actividad de la plataforma"
        description="Distribución actual de estaciones, conectores y sesiones según las métricas disponibles."
      />

      <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
        <AdminDashboardCharts
          stations={metrics.stations.data}
          connectors={metrics.connectors.data}
          sessions={metrics.sessions.data}
        />
      </div>
    </section>
  );
}
