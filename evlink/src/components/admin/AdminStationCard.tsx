
import Link from "next/link";
import { ArrowUpRight, MapPin, X } from "lucide-react";

import { StationStatusBadge } from "@/components/admin/StationStatusBadge";
import { stationStatusLabels } from "@/schemas/charging-station";
import type { ChargingStationWithConnectors } from "@/types";

type AdminStationCardProps = {
  station: ChargingStationWithConnectors;
  onClose?: () => void;
};

export function AdminStationCard({
  station,
  onClose,
}: AdminStationCardProps) {
  const connectorCount = station.connectors.length;

  return (
    <div className="w-[min(360px,calc(100vw-32px))] rounded-2xl border border-border bg-card p-4 text-card-foreground shadow-xl">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
          <MapPin className="size-5 text-primary" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold">{station.name}</p>

          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
            {station.address}, {station.city}
          </p>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar estación seleccionada"
            className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <StationStatusBadge
          status={station.status}
          label={stationStatusLabels[station.status]}
        />

        <span className="text-xs text-muted-foreground">
          {connectorCount}{" "}
          {connectorCount === 1 ? "conector" : "conectores"}
        </span>
      </div>

      <Link
        href={`/admin/stations/${station.id}`}
        className="mt-4 flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        Gestionar estación
        <ArrowUpRight className="size-4" />
      </Link>
    </div>
  );
}
