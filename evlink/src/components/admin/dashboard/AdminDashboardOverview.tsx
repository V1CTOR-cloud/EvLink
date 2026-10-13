import { MapPin, Plug, Users, Zap } from "lucide-react";

import type { AdminDashboardMetrics } from "@/services/admin-dashboard";
import type { Segment } from "@/components/admin/AdminStatusBreakdown";

import { MetricCard } from "./MetricCard";
import { SectionHeading } from "./SectionHeading";

type AdminDashboardOverviewProps = {
  metrics: AdminDashboardMetrics;
};

export function AdminDashboardOverview({
  metrics,
}: AdminDashboardOverviewProps) {
  const stationSegments: Segment[] = [
    {
      label: "Disponibles",
      value: metrics.stations.data?.available ?? null,
      tone: "success",
    },
    {
      label: "Ocupadas",
      value: metrics.stations.data?.occupied ?? null,
      tone: "brand",
    },
    {
      label: "Fuera de servicio",
      value: metrics.stations.data?.offline ?? null,
      tone: "danger",
    },
    {
      label: "Mantenimiento",
      value: metrics.stations.data?.maintenance ?? null,
      tone: "warning",
    },
  ];

  const connectorSegments: Segment[] = [
    {
      label: "Disponibles",
      value: metrics.connectors.data?.available ?? null,
      tone: "success",
    },
    {
      label: "Ocupados",
      value: metrics.connectors.data?.occupied ?? null,
      tone: "brand",
    },
    {
      label: "Fuera de servicio",
      value: metrics.connectors.data?.offline ?? null,
      tone: "danger",
    },
    {
      label: "Mantenimiento",
      value: metrics.connectors.data?.maintenance ?? null,
      tone: "warning",
    },
  ];

  const sessionSegments: Segment[] = [
    {
      label: "Completadas",
      value: metrics.sessions.data?.completed ?? null,
      tone: "success",
    },
    {
      label: "Activas",
      value: metrics.sessions.data?.active ?? null,
      tone: "brand",
    },
    {
      label: "Fallidas",
      value: metrics.sessions.data?.failed ?? null,
      tone: "danger",
    },
    {
      label: "Canceladas",
      value: metrics.sessions.data?.cancelled ?? null,
      tone: "warning",
    },
  ];

  const userSegments: Segment[] = [
    {
      label: "Conductores",
      value: metrics.users.data?.drivers ?? null,
      tone: "brand",
    },
    {
      label: "Administradores",
      value: metrics.users.data?.admins ?? null,
      tone: "neutral",
    },
  ];

  return (
    <section aria-labelledby="admin-overview-title" className="space-y-4">
      <SectionHeading
        id="admin-overview-title"
        eyebrow="Resumen"
        title="Estado de la plataforma"
        description="Vista general de la infraestructura, las sesiones y los usuarios."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Estaciones"
          value={metrics.stations.data?.total ?? null}
          icon={MapPin}
          segments={stationSegments}
          href="/admin/stations"
        />

        <MetricCard
          title="Conectores"
          value={metrics.connectors.data?.total ?? null}
          icon={Plug}
          segments={connectorSegments}
          href="/admin/stations"
        />

        <MetricCard
          title="Sesiones"
          value={metrics.sessions.data?.total ?? null}
          icon={Zap}
          segments={sessionSegments}
          href="/admin/sessions"
        />

        <MetricCard
          title="Usuarios"
          value={metrics.users.data?.total ?? null}
          icon={Users}
          segments={userSegments}
          href="/admin/users"
        />
      </div>
    </section>
  );
}
