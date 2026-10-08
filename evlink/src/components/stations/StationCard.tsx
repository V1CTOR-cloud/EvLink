import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";

import type { ChargingStationWithConnectors } from "@/types";
import { ConnectorItem } from "./ConnectorItem";

type StationCardProps = {
  station: ChargingStationWithConnectors;
};

export function StationCard({ station }: StationCardProps) {
  const availableConnectors = station.connectors.filter(
    (connector) => connector.status === "available",
  );

  const occupiedConnectors = station.connectors.filter(
    (connector) => connector.status === "occupied",
  );

  const isAvailable = availableConnectors.length > 0;
  const isOccupied = !isAvailable && occupiedConnectors.length > 0;

  const statusLabel = isAvailable
    ? "Disponible"
    : isOccupied
      ? "Ocupada"
      : "Sin disponibilidad";

  const statusClassName = isAvailable
    ? "bg-primary/10 text-primary"
    : isOccupied
      ? "bg-yellow-500/10 text-yellow-600"
      : "bg-muted text-muted-foreground";

  const statusDotClassName = isAvailable
    ? "bg-primary"
    : isOccupied
      ? "bg-yellow-500"
      : "bg-muted-foreground";

  return (
    <div className="group rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/30 hover:bg-primary/2">
      {/* Station information */}
      <Link href={`/stations/${station.id}`} className="block">
        <div className="flex items-start justify-between gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <MapPin className="size-4 text-primary" />
          </div>

          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[10px] font-medium ${statusClassName}`}
          >
            <span className={`size-1.5 rounded-full ${statusDotClassName}`} />

            {statusLabel}
          </span>
        </div>

        <div className="mt-4">
          <p className="truncate text-sm font-semibold">{station.name}</p>

          <p className="mt-1 truncate text-xs text-muted-foreground">
            {station.address}
          </p>

          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {station.city}
          </p>
        </div>
      </Link>

      {/* Available connectors */}
      {availableConnectors.length > 0 && (
        <div className="mt-4 border-t border-border pt-3">
          <p className="mb-2 text-[11px] text-muted-foreground">
            Conectores disponibles
          </p>

          <div className="flex gap-2">
            {availableConnectors.map((connector) => (
              <ConnectorItem key={connector.id} connector={connector} />
            ))}
          </div>
        </div>
      )}

      {/* Station detail */}
      <Link
        href={`/stations/${station.id}`}
        className="mt-4 flex items-center justify-between border-t border-border pt-3"
      >
        <span className="text-[11px] text-muted-foreground">Ver estación</span>

        <ArrowUpRight className="size-3.5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}
