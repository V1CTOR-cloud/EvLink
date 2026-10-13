"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, MapPin, Plus, Search } from "lucide-react";
import Link from "next/link";

import { ChargingStationDeleteAction } from "@/components/admin/ChargingStationDeleteAction";
import { StationStatusBadge } from "@/components/admin/StationStatusBadge";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { stationStatusLabels } from "@/schemas/charging-station";
import type { ChargingStationWithConnectors } from "@/types";

type AdminStationsListProps = {
  stations: ChargingStationWithConnectors[];
};

function normalizeSearch(value: string) {
  return value.trim().replace(/\s+/g, " ").toLocaleLowerCase("es-ES");
}

export function AdminStationsList({ stations }: AdminStationsListProps) {
  const [search, setSearch] = useState("");
  const filteredStations = useMemo(() => {
    const query = normalizeSearch(search);

    if (!query) return stations;

    return stations.filter((station) =>
      normalizeSearch(
        [station.name, station.address, station.city].join(" "),
      ).includes(query),
    );
  }, [search, stations]);

  return (
    <section className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Estaciones</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gestiona las estaciones de recarga y consulta sus conectores.
          </p>
        </div>
        <Link
          href="/admin/stations/new"
          className={buttonVariants({
            variant: "outline",
            className:
              "w-full border-primary/30 bg-primary/10 text-foreground hover:bg-primary/15 sm:w-auto",
          })}
        >
          <Plus aria-hidden="true" />
          Nueva estación
        </Link>
      </div>

      <div className="relative max-w-md">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label="Buscar estaciones por nombre, dirección o ciudad"
          placeholder="Buscar por nombre, dirección o ciudad..."
          className="pl-9"
        />
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {filteredStations.length}{" "}
          {filteredStations.length === 1 ? "estación" : "estaciones"}
          {search.trim() ? " encontradas" : ""}
        </span>
      </div>

      {filteredStations.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl border border-dashed px-6 py-14 text-center">
          <div className="mb-4 flex size-11 items-center justify-center rounded-full bg-muted">
            <MapPin aria-hidden="true" className="size-5 text-muted-foreground" />
          </div>
          <h2 className="font-medium">
            {search.trim()
              ? "No hay estaciones que coincidan"
              : "Todavía no hay estaciones"}
          </h2>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            {search.trim()
              ? "Prueba con otro nombre, dirección o ciudad."
              : "Crea la primera estación para empezar a gestionar la red."}
          </p>
          {!search.trim() && (
            <Link
              href="/admin/stations/new"
              className={buttonVariants({
                variant: "outline",
                className:
                  "mt-5 border-primary/30 bg-primary/10 text-foreground hover:bg-primary/15",
              })}
            >
              <Plus aria-hidden="true" />
              Crear estación
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="grid gap-3 md:hidden">
            {filteredStations.map((station) => (
              <article
                key={station.id}
                className="group relative rounded-xl border border-border bg-card p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-sm motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-5"
              >
                <Link
                  href={`/admin/stations/${station.id}`}
                  aria-label={`Ver estación ${station.name}`}
                  className="absolute inset-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                />
                <div className="flex items-start gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted transition-colors group-hover:bg-primary/10">
                    <MapPin
                      aria-hidden="true"
                      className="size-4 text-muted-foreground transition-colors group-hover:text-primary"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="truncate text-sm font-semibold">
                      {station.name}
                    </h2>
                    <p className="mt-1 break-words text-xs text-muted-foreground">
                      {station.address}, {station.city}
                    </p>
                  </div>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="pointer-events-none size-4 shrink-0 text-muted-foreground"
                  />
                </div>
                <div className="mt-4 flex items-center justify-between gap-2 border-t border-border pt-3">
                  <StationStatusBadge
                    status={station.status}
                    label={stationStatusLabels[station.status]}
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-muted-foreground">
                      {station.connectors.length}{" "}
                      {station.connectors.length === 1
                        ? "conector"
                        : "conectores"}
                    </span>
                    <ChargingStationDeleteAction
                      stationId={station.id}
                      stationName={station.name}
                      connectorCount={station.connectors.length}
                      iconOnly
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="hidden overflow-hidden rounded-xl border border-border bg-card md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-180 text-sm">
                <caption className="sr-only">Lista de estaciones</caption>
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-5 py-3 text-left text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                      Estación
                    </th>
                    <th className="px-5 py-3 text-left text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                      Estado
                    </th>
                    <th className="px-5 py-3 text-left text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                      Conectores
                    </th>
                    <th className="px-3 py-3 text-right text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                      <span className="sr-only">Acciones</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredStations.map((station) => (
                    <tr
                      key={station.id}
                      className="group relative transition-colors hover:bg-muted/40"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted transition-colors group-hover:bg-primary/10">
                            <MapPin className="size-4 text-muted-foreground transition-colors group-hover:text-primary" />
                          </div>
                          <div className="min-w-0">
                            <Link
                              href={`/admin/stations/${station.id}`}
                              className="block truncate font-medium after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-ring focus-visible:after:ring-inset"
                            >
                              {station.name}
                            </Link>
                            <p className="truncate text-xs text-muted-foreground">
                              {station.address}, {station.city}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <StationStatusBadge
                          status={station.status}
                          label={stationStatusLabels[station.status]}
                        />
                      </td>
                      <td className="px-5 py-3.5 text-xs text-muted-foreground">
                        {station.connectors.length}
                      </td>
                      <td className="px-3 py-3.5">
                        <div className="relative z-10 flex items-center justify-end gap-1">
                          <ChargingStationDeleteAction
                            stationId={station.id}
                            stationName={station.name}
                            connectorCount={station.connectors.length}
                            iconOnly
                          />
                          <ArrowUpRight
                            aria-hidden="true"
                            className="pointer-events-none size-4 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
