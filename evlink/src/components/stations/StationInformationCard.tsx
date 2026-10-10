import { MapPin } from "lucide-react";

import { MiniStationMap } from "@/components/stations/MiniStationMap";
import type { ChargingStationWithConnectors } from "@/types";
import Link from "next/link";

type StationInformationCardProps = {
  station: ChargingStationWithConnectors;
};

export function StationInformationCard({
  station,
}: StationInformationCardProps) {
  const isAvailable = station.connectors.some(
    (connector) => connector.status === "available",
  );

  return (
    <section className="rounded-xl border border-border bg-card">
      <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
            <MapPin className="size-4 text-primary" />
          </div>

          <div className="min-w-0">
            <h2 className="break-words font-semibold">Información de la estación</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Ubicación y detalles de la estación
            </p>
          </div>
        </div>
        <Link
          href={`https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:w-auto"
        >
          Cómo llegar
        </Link>
      </div>

      <div className="border-t border-border">
        {station.description && (
          <div className="border-b border-border px-5 py-4">
            <p className="text-xs text-muted-foreground">Descripción</p>

            <p className="mt-1 text-sm leading-relaxed">
              {station.description}
            </p>
          </div>
        )}
        <div className="grid sm:grid-cols-2">
          <div className="border-b border-border px-5 py-4 sm:border-r">
            <p className="text-xs text-muted-foreground">Dirección</p>

            <p className="mt-1 text-sm font-medium">{station.address}</p>
          </div>

          <div className="border-b border-border px-5 py-4">
            <p className="text-xs text-muted-foreground">Ciudad</p>

            <p className="mt-1 text-sm font-medium">{station.city}</p>
          </div>
        </div>

        <div className="px-5 py-4">
          <p className="mb-3 text-xs text-muted-foreground">
            Ubicación en el mapa
          </p>

          <MiniStationMap
            latitude={Number(station.latitude)}
            longitude={Number(station.longitude)}
            isAvailable={isAvailable}
          />
        </div>
      </div>
    </section>
  );
}
