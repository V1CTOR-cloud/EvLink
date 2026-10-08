import { MapPin } from "lucide-react";

import type { ChargingStationWithConnectors } from "@/types";

type StationInformationCardProps = {
  station: ChargingStationWithConnectors;
};

export function StationInformationCard({
  station,
}: StationInformationCardProps) {
  return (
    <section className="rounded-xl border border-border bg-card">
      <div className="flex items-center gap-3 px-5 py-4">
        <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
          <MapPin className="size-4 text-primary" />
        </div>

        <div>
          <h2 className="font-semibold">Información de la estación</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Ubicación y detalles de la estación
          </p>
        </div>
      </div>

      <div className="border-t border-border">
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
          <p className="text-xs text-muted-foreground">Coordenadas</p>

          <p className="mt-1 font-mono text-sm">
            {station.latitude}, {station.longitude}
          </p>
        </div>

        {station.description && (
          <div className="border-t border-border px-5 py-4">
            <p className="text-xs text-muted-foreground">Descripción</p>

            <p className="mt-1 text-sm leading-relaxed">
              {station.description}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
