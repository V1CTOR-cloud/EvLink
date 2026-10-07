import { ArrowUpRight, MapPin, Zap } from "lucide-react";
import Link from "next/link";

import type { DashboardStation } from "@/types";

type DashboardStationsProps = {
  stations: DashboardStation[];
};

const connectorLabels = {
  type_2: "Type 2",
  ccs2: "CCS2",
  chademo: "CHAdeMO",
} as const;

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
          {stations.map((station) => {
            const availableConnectors = station.connectors
              .filter((connector) => connector.status === "available")
              .slice(0, 2);

            return (
              <Link
                key={station.id}
                href="/stations"
                className="group rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/30 hover:bg-primary/2"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <MapPin className="size-4 text-primary" />
                  </div>

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2 py-1 text-[10px] font-medium text-primary">
                    <span className="size-1.5 rounded-full bg-primary" />
                    Disponible
                  </span>
                </div>

                <div className="mt-4">
                  <p className="truncate text-sm font-semibold">
                    {station.name}
                  </p>

                  <p className="mt-1 truncate text-xs text-muted-foreground">
                    {station.address}
                  </p>

                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {station.city}
                  </p>
                </div>

                <div className="mt-4 border-t border-border pt-3">
                  <p className="mb-2 text-[11px] text-muted-foreground">
                    Conectores disponibles
                  </p>

                  {availableConnectors.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {availableConnectors.map((connector) => (
                        <span
                          key={`${station.id}-${connector.connector_type}`}
                          className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2 py-1 text-[10px] font-medium"
                        >
                          <Zap className="size-3 text-primary" />

                          {connectorLabels[connector.connector_type]}

                          <span className="text-muted-foreground">
                            {connector.power_kw} kW
                          </span>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-muted-foreground">
                      Sin conectores libres
                    </p>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                  <span className="text-[11px] text-muted-foreground">
                    Ver estación
                  </span>

                  <ArrowUpRight className="size-3.5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
