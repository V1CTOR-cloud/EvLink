import {
  Activity,
  MapPin,
  Plug,
} from "lucide-react";

import type { AdminDashboardMetrics } from "@/services/admin-dashboard";

import { NetworkMeter } from "./NetworkMeter";

type CapacityCardProps = {
  stations: AdminDashboardMetrics["stations"]["data"];
  connectors: AdminDashboardMetrics["connectors"]["data"];
};

export function CapacityCard({
  stations,
  connectors,
}: CapacityCardProps) {
  const operationalStations = stations?.operational ?? null;
  const totalStations = stations?.total ?? null;

  const availableConnectors = connectors?.available ?? null;
  const occupiedConnectors = connectors?.occupied ?? null;
  const offlineConnectors = connectors?.offline ?? null;
  const maintenanceConnectors = connectors?.maintenance ?? null;
  const totalConnectors = connectors?.total ?? null;

  const inServiceConnectors =
    availableConnectors !== null && occupiedConnectors !== null
      ? availableConnectors + occupiedConnectors
      : null;

  const outOfServiceConnectors =
    offlineConnectors !== null && maintenanceConnectors !== null
      ? offlineConnectors + maintenanceConnectors
      : null;

  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-background">
          <Activity className="size-5 text-muted-foreground" />
        </div>

        <div>
          <h3 className="font-semibold tracking-tight">
            Capacidad de la red
          </h3>
          <p className="mt-1 text-sm leading-5 text-muted-foreground">
            Disponibilidad de estaciones y conectores en la infraestructura.
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <MapPin className="size-4 text-muted-foreground" />
            Estaciones
          </div>

          <NetworkMeter
            label="Estaciones operativas"
            value={operationalStations}
            total={totalStations}
            totalSuffix="estaciones"
          />
        </div>

        <div className="space-y-4 border-t border-border pt-5">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Plug className="size-4 text-muted-foreground" />
            Conectores
          </div>

          <NetworkMeter
            label="Disponibles"
            value={availableConnectors}
            total={totalConnectors}
            totalSuffix="conectores"
          />

          <NetworkMeter
            label="Ocupados"
            value={occupiedConnectors}
            total={inServiceConnectors}
            totalSuffix="en servicio"
          />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3 rounded-lg bg-muted/50 px-4 py-3">
        <div>
          <p className="text-sm font-medium">Fuera de servicio</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Offline o en mantenimiento
          </p>
        </div>

        <p className="text-xl font-semibold tabular-nums">
          {outOfServiceConnectors ?? "—"}
        </p>
      </div>
    </section>
  );
}