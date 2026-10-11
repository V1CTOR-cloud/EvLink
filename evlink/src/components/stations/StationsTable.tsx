"use client";

import { Fragment, useState } from "react";
import {
  ArrowUpRight,
  ChevronDown,
  CircleCheck,
  CircleSlash,
  MapPin,
  Plug,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

import { ConnectorRow } from "@/components/stations/ConnectorRow";
import { connectorTypeLabels } from "@/lib/session-utils";
import {
  getStationAvailability,
  stationAvailabilityLabels,
  type StationAvailabilityKey,
} from "@/lib/stations-availability";
import { cn } from "@/lib/utils";
import type { ChargingStationWithConnectors, Connector } from "@/types";

type StationTableProps = {
  stations: ChargingStationWithConnectors[];
};

const COLUMN_COUNT = 7;

const headerClasses =
  "px-5 py-3 text-left text-[11px] font-medium uppercase tracking-wide text-muted-foreground";

const availabilityClasses: Record<StationAvailabilityKey, string> = {
  available: "bg-green-500/10 text-green-600",
  occupied: "bg-yellow-500/10 text-yellow-600",
  unavailable: "bg-muted text-muted-foreground",
};

const availabilityIcons: Record<StationAvailabilityKey, LucideIcon> = {
  available: CircleCheck,
  occupied: Plug,
  unavailable: CircleSlash,
};

// Libres primero, después ocupados y por último el resto.
const connectorOrder: Record<string, number> = { available: 0, occupied: 1 };

function sortConnectors(connectors: Connector[]) {
  return [...connectors].sort(
    (a, b) => (connectorOrder[a.status] ?? 2) - (connectorOrder[b.status] ?? 2),
  );
}

function getStationSummary(station: ChargingStationWithConnectors) {
  const { key, availableConnectors, totalConnectors } =
    getStationAvailability(station);

  const types = [
    ...new Set(availableConnectors.map((connector) => connector.connector_type)),
  ];

  const powers = availableConnectors
    .map((connector) => Number(connector.power_kw))
    .filter(Number.isFinite);

  const prices = availableConnectors
    .map((connector) => Number(connector.price_per_kwh))
    .filter(Number.isFinite);

  return {
    key,
    freeCount: availableConnectors.length,
    totalConnectors,
    types,
    maxPower: powers.length > 0 ? Math.max(...powers) : null,
    minPrice: prices.length > 0 ? Math.min(...prices) : null,
  };
}

export function StationTable({ stations }: StationTableProps) {
  // Una sola estación desplegada a la vez.
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function toggleStation(stationId: string) {
    setExpandedId((current) => (current === stationId ? null : stationId));
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <caption className="sr-only">Lista de estaciones</caption>

          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className={cn(headerClasses, "w-10 pr-0")}>
                <span className="sr-only">Conectores</span>
              </th>
              <th className={cn(headerClasses, "pl-2")}>Estación</th>
              <th className={headerClasses}>Estado</th>
              <th className={cn(headerClasses, "hidden sm:table-cell")}>
                Conectores libres
              </th>
              <th className={cn(headerClasses, "hidden md:table-cell")}>
                Potencia máx.
              </th>
              <th className={cn(headerClasses, "hidden md:table-cell")}>
                Precio desde
              </th>
              <th className={cn(headerClasses, "w-12")}>
                <span className="sr-only">Ver estación</span>
              </th>
            </tr>
          </thead>

          <tbody>
            {stations.map((station) => {
              const summary = getStationSummary(station);
              const StatusIcon = availabilityIcons[summary.key];

              const hasConnectors = station.connectors.length > 0;
              const isExpanded = hasConnectors && expandedId === station.id;
              const panelId = `station-connectors-${station.id}`;

              return (
                <Fragment key={station.id}>
                  <tr
                    className={cn(
                      "group relative border-t border-border transition-colors hover:bg-muted/40",
                      isExpanded && "bg-muted/30",
                    )}
                  >
                    <td className="py-3.5 pl-3 pr-0">
                      {hasConnectors ? (
                        <button
                          type="button"
                          onClick={() => toggleStation(station.id)}
                          aria-expanded={isExpanded}
                          aria-controls={isExpanded ? panelId : undefined}
                          aria-label={`${isExpanded ? "Ocultar" : "Mostrar"} conectores de ${station.name}`}
                          className="relative z-10 flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <ChevronDown
                            className={cn(
                              "size-4 transition-transform duration-200 motion-reduce:transition-none",
                              isExpanded && "rotate-180",
                            )}
                          />
                        </button>
                      ) : (
                        <span className="block size-8" aria-hidden />
                      )}
                    </td>

                    <td className="py-3.5 pl-2 pr-5">
                      <div className="flex max-w-72 items-center gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted transition-colors group-hover:bg-primary/10">
                          <MapPin className="size-4 text-muted-foreground transition-colors group-hover:text-primary" />
                        </div>

                        <div className="min-w-0">
                          {/* El after: cubre toda la fila, que lleva al detalle */}
                          <Link
                            href={`/stations/${station.id}`}
                            className="block truncate font-medium after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-ring focus-visible:after:ring-inset"
                          >
                            {station.name}
                          </Link>

                          <p className="mt-0.5 truncate text-xs text-muted-foreground">
                            {station.address}, {station.city}
                          </p>

                          <p className="mt-0.5 text-[11px] text-muted-foreground sm:hidden">
                            {summary.freeCount} de {summary.totalConnectors}{" "}
                            libres
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-3.5">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium",
                          availabilityClasses[summary.key],
                        )}
                      >
                        <StatusIcon className="size-3.5" />
                        {stationAvailabilityLabels[summary.key]}
                      </span>
                    </td>

                    <td className="hidden px-5 py-3.5 sm:table-cell">
                      <p className="text-sm font-medium">
                        {summary.freeCount} de {summary.totalConnectors}
                      </p>

                      {summary.types.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {summary.types.map((type) => (
                            <span
                              key={type}
                              className="rounded-md bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground"
                            >
                              {connectorTypeLabels[type]}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>

                    <td className="hidden px-5 py-3.5 text-sm md:table-cell">
                      {summary.maxPower !== null
                        ? `${summary.maxPower.toLocaleString("es-ES", {
                            maximumFractionDigits: 1,
                          })} kW`
                        : "—"}
                    </td>

                    <td className="hidden px-5 py-3.5 text-sm md:table-cell">
                      {summary.minPrice !== null
                        ? `${summary.minPrice.toLocaleString("es-ES", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 3,
                          })} €/kWh`
                        : "—"}
                    </td>

                    <td className="px-3 py-3.5">
                      <ArrowUpRight className="pointer-events-none ml-auto size-4 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
                    </td>
                  </tr>

                  {isExpanded && (
                    <tr id={panelId} className="bg-muted/30">
                      <td
                        colSpan={COLUMN_COUNT}
                        className="px-4 pb-4 pt-0 sm:pl-14 sm:pr-5"
                      >
                        <ul
                          aria-label={`Conectores de ${station.name}`}
                          className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card"
                        >
                          {sortConnectors(station.connectors).map(
                            (connector) => (
                              <li key={connector.id}>
                                <ConnectorRow connector={connector} />
                              </li>
                            ),
                          )}
                        </ul>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}