import { ArrowLeft, MapPin } from "lucide-react";
import Link from "next/link";

import type { ChargingStationWithConnectors } from "@/types";

type StationDetailHeaderProps = {
  station: ChargingStationWithConnectors;
};

const statusLabels: Record<ChargingStationWithConnectors["status"], string> = {
  available: "Disponible",
  occupied: "Ocupada",
  offline: "Fuera de servicio",
  maintenance: "Mantenimiento",
};

const statusClasses: Record<ChargingStationWithConnectors["status"], string> = {
  available: "bg-primary/10 text-primary",
  occupied: "bg-yellow-500/10 text-yellow-600",
  offline: "bg-muted text-muted-foreground",
  maintenance: "bg-yellow-500/10 text-yellow-600",
};

export function StationDetailHeader({ station }: StationDetailHeaderProps) {
  const availableConnectors = station.connectors.filter(
    (connector) => connector.status === "available",
  );

  const isAvailable = availableConnectors.length > 0;

  return (
    <div className="space-y-6">
      <Link
        href="/stations"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Volver a estaciones
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <MapPin className="size-5 text-primary" />
          </div>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {station.name}
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              {station.address}, {station.city}
            </p>
          </div>
        </div>

        <span
          className={[
            "inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium",
            isAvailable
              ? statusClasses.available
              : statusClasses[station.status],
          ].join(" ")}
        >
          {isAvailable && <span className="size-1.5 rounded-full bg-current" />}

          {isAvailable ? statusLabels.available : statusLabels[station.status]}
        </span>
      </div>
    </div>
  );
}
