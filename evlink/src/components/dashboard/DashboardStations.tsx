import { ArrowUpRight, MapPin } from "lucide-react";
import Link from "next/link";

import { StationCard } from "../stations/StationCard";
import { ChargingStationWithConnectors } from "@/types";

type DashboardStationsProps = {
  stations: ChargingStationWithConnectors[];
};

export function DashboardStations({ stations }: DashboardStationsProps) {
  return (
    <section className="mt-6">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold">Estaciones disponibles</h2>

          <p className="text-xs text-muted-foreground">
            Algunas estaciones disponibles ahora
          </p>
        </div>

        <Link
          href="/stations"
          className="group inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Ver todas
          <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </div>

      {stations.length === 0 ? (
        <div className="rounded-xl border border-border bg-card px-5 py-8 text-center">
          <div className="mx-auto flex size-9 items-center justify-center rounded-lg bg-muted">
            <MapPin className="size-4 text-muted-foreground" />
          </div>

          <p className="mt-3 text-sm font-medium">
            No hay estaciones disponibles
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Actualmente no hay estaciones disponibles para cargar.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-3">
          {stations.map((station) => (
            <StationCard key={station.id} station={station} />
          ))}
        </div>
      )}
    </section>
  );
}
