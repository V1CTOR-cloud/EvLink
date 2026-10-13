"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { List, Map as MapIcon, Plus, RotateCcw, Search } from "lucide-react";

import { AdminStationCard } from "@/components/admin/AdminStationCard";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StationCard } from "@/components/stations/StationCard";
import {
  StationFilters,
  type NumericRange,
  type StationFiltersState,
} from "@/components/stations/StationFilters";
import { connectorTypeLabels } from "@/lib/session-utils";
import type { ChargingStationWithConnectors, Connector } from "@/types";
import { StationTable } from "./StationsTable";
import Link from "next/link";

const StationsMap = dynamic(
  () =>
    import("@/components/stations/StationsMap").then(
      (module) => module.StationsMap,
    ),
  {
    ssr: false,
    loading: () => (
      <div
        role="status"
        aria-label="Cargando mapa de estaciones"
        className="h-150 w-full animate-pulse rounded-2xl border bg-muted/30"
      >
        <span className="sr-only">Cargando mapa de estaciones...</span>
      </div>
    ),
  },
);

type StationsExplorerProps = {
  stations: ChargingStationWithConnectors[];
  mode?: "user" | "admin";
};

type ViewMode = "map" | "list";

const defaultFilters: StationFiltersState = {
  availability: "all",
  connectorTypes: [],
  minPower: null,
  maxPower: null,
  minPrice: null,
  maxPrice: null,
};

function hasAvailableConnector(station: ChargingStationWithConnectors) {
  return station.connectors.some(
    (connector) => connector.status === "available",
  );
}

function normalizeSearchText(value: string) {
  return value.trim().replace(/\s+/g, " ").toLocaleLowerCase("es-ES");
}

function getNumericRange(values: number[]): NumericRange {
  const validValues = values.filter(
    (value) => Number.isFinite(value) && value >= 0,
  );

  if (validValues.length === 0) {
    return { min: null, max: null };
  }

  return {
    min: Math.min(...validValues),
    max: Math.max(...validValues),
  };
}

function matchesConnectorFilters(
  connector: Connector,
  filters: StationFiltersState,
) {
  if (
    filters.connectorTypes.length > 0 &&
    !filters.connectorTypes.includes(connector.connector_type)
  ) {
    return false;
  }

  const power = connector.power_kw;

  if (
    (filters.minPower !== null || filters.maxPower !== null) &&
    (!Number.isFinite(power) ||
      (filters.minPower !== null && power < filters.minPower) ||
      (filters.maxPower !== null && power > filters.maxPower))
  ) {
    return false;
  }

  const price = connector.price_per_kwh;

  if (
    (filters.minPrice !== null || filters.maxPrice !== null) &&
    (!Number.isFinite(price) ||
      (filters.minPrice !== null && price < filters.minPrice) ||
      (filters.maxPrice !== null && price > filters.maxPrice))
  ) {
    return false;
  }

  return true;
}

export function StationsExplorer({
  stations,
  mode = "user",
}: StationsExplorerProps) {
  const [selectedStationId, setSelectedStationId] = useState<string | null>(
    null,
  );
  const [viewMode, setViewMode] = useState<ViewMode>("map");
  const [search, setSearch] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<StationFiltersState>(defaultFilters);

  // Los usuarios filtran por conectores disponibles.
  // Los administradores pueden filtrar por todos los estados.
  const filterableConnectors = useMemo(
    () =>
      stations.flatMap((station) =>
        station.connectors.filter(
          (connector) => mode === "admin" || connector.status === "available",
        ),
      ),
    [mode, stations],
  );

  const connectorTypes = useMemo(() => {
    const types = new Set<Connector["connector_type"]>();

    filterableConnectors.forEach((connector) => {
      types.add(connector.connector_type);
    });

    return [...types].sort((left, right) =>
      connectorTypeLabels[left].localeCompare(connectorTypeLabels[right]),
    );
  }, [filterableConnectors]);

  const powerRange = useMemo(
    () =>
      getNumericRange(
        filterableConnectors.map((connector) => connector.power_kw),
      ),
    [filterableConnectors],
  );

  const priceRange = useMemo(
    () =>
      getNumericRange(
        filterableConnectors.map((connector) => connector.price_per_kwh),
      ),
    [filterableConnectors],
  );

  const normalizedSearch = normalizeSearchText(search);

  const hasInvalidRange =
    (filters.minPower !== null && !Number.isFinite(filters.minPower)) ||
    (filters.maxPower !== null && !Number.isFinite(filters.maxPower)) ||
    (filters.minPrice !== null && !Number.isFinite(filters.minPrice)) ||
    (filters.maxPrice !== null && !Number.isFinite(filters.maxPrice)) ||
    (filters.minPower !== null &&
      filters.maxPower !== null &&
      filters.minPower > filters.maxPower) ||
    (filters.minPrice !== null &&
      filters.maxPrice !== null &&
      filters.minPrice > filters.maxPrice);

  const filteredStations = useMemo(() => {
    if (hasInvalidRange) {
      return [];
    }

    return stations.filter((station) => {
      const searchableText = normalizeSearchText(
        [station.name, station.address, station.city].filter(Boolean).join(" "),
      );

      if (!searchableText.includes(normalizedSearch)) {
        return false;
      }

      const available = hasAvailableConnector(station);

      if (
        (filters.availability === "available" && !available) ||
        (filters.availability === "unavailable" && available)
      ) {
        return false;
      }

      const hasConnectorCriteria =
        filters.connectorTypes.length > 0 ||
        filters.minPower !== null ||
        filters.maxPower !== null ||
        filters.minPrice !== null ||
        filters.maxPrice !== null;

      if (!hasConnectorCriteria) {
        return true;
      }

      return station.connectors.some(
        (connector) =>
          (mode === "admin" || connector.status === "available") &&
          matchesConnectorFilters(connector, filters),
      );
    });
  }, [filters, hasInvalidRange, normalizedSearch, stations, mode]);

  const activeFilterCount =
    Number(normalizedSearch.length > 0) +
    Number(filters.availability !== "all") +
    Number(filters.connectorTypes.length > 0) +
    Number(filters.minPower !== null || filters.maxPower !== null) +
    Number(filters.minPrice !== null || filters.maxPrice !== null);

  const hasActiveFilters = activeFilterCount > 0;

  function dismissSelectedStation() {
    toast.dismiss("selected-station");
    setSelectedStationId(null);
  }

  function clearFilters() {
    setSearch("");
    setFilters(defaultFilters);
    dismissSelectedStation();
  }

  function handleSearchChange(value: string) {
    setSearch(value);
    dismissSelectedStation();
  }

  function handleFiltersChange(nextFilters: StationFiltersState) {
    setFilters(nextFilters);
    dismissSelectedStation();
  }

  function handleSelectStation(stationId: string) {
    const station = filteredStations.find((item) => item.id === stationId);

    if (!station) {
      return;
    }

    setSelectedStationId(stationId);

    toast.custom(
      (toastId) => {
        const cardProps = {
          station,
          onClose: () => {
            toast.dismiss(toastId);
            setSelectedStationId(null);
          },
        };

        return mode === "admin" ? (
          <AdminStationCard {...cardProps} />
        ) : (
          <StationCard {...cardProps} variant="compact" />
        );
      },
      {
        id: "selected-station",
        duration: Infinity,
        position: "bottom-right",
        unstyled: true,
        className: "!bg-transparent !border-0 !p-0 !shadow-none m-6",
      },
    );
  }

  function handleViewChange(nextViewMode: ViewMode) {
    setViewMode(nextViewMode);

    if (nextViewMode === "list") {
      dismissSelectedStation();
    }
  }

  useEffect(() => {
    return () => {
      toast.dismiss("selected-station");
    };
  }, []);

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold">
            {mode === "admin" ? "Explorar estaciones" : "Estaciones"}
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            {filteredStations.length}{" "}
            {filteredStations.length === 1 ? "estación" : "estaciones"}
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <label className="relative min-w-0 flex-1 sm:w-64 sm:flex-none">
            <span className="sr-only">
              Buscar estación por nombre, dirección o ciudad
            </span>

            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              type="search"
              value={search}
              onChange={(event) => handleSearchChange(event.target.value)}
              placeholder="Buscar estación..."
              className="h-9 pl-9"
            />
          </label>

          <div className="flex items-center justify-between gap-2 sm:justify-end">
            <StationFilters
              open={filtersOpen}
              onOpenChange={setFiltersOpen}
              filters={filters}
              onFiltersChange={handleFiltersChange}
              connectorTypes={connectorTypes}
              powerRange={powerRange}
              priceRange={priceRange}
              activeFilterCount={activeFilterCount}
              canClear={hasActiveFilters}
              onClear={clearFilters}
            />

            {mode === "admin" && (
              <Link
                href="/admin/stations/new"
                className={buttonVariants({
                  variant: "default",
                  size: "lg",
                  className:
                    "h-9 shrink-0 gap-2 rounded-lg px-3 font-medium shadow-none",
                })}
              >
                <Plus className="size-4" strokeWidth={2} />
                <span>Añadir estación</span>
              </Link>
            )}

            <div
              className="inline-flex shrink-0 rounded-lg border border-border bg-card p-0.5"
              role="group"
              aria-label="Vista de estaciones"
            >
              <Button
                type="button"
                variant={viewMode === "map" ? "secondary" : "ghost"}
                size="sm"
                aria-label="Vista de mapa"
                aria-pressed={viewMode === "map"}
                onClick={() => handleViewChange("map")}
                className="h-10 min-w-10 px-2"
              >
                <MapIcon className="size-4" />
                <span className="sr-only sm:not-sr-only">Mapa</span>
              </Button>

              <Button
                type="button"
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="sm"
                aria-label="Vista de lista"
                aria-pressed={viewMode === "list"}
                onClick={() => handleViewChange("list")}
                className="h-10 min-w-10 px-2"
              >
                <List className="size-4" />
                <span className="sr-only sm:not-sr-only">Listado</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {filteredStations.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-8 text-center">
          <p className="text-sm font-medium">
            {stations.length === 0
              ? "No hay estaciones registradas."
              : "No se encontraron estaciones."}
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            {stations.length === 0
              ? "Cuando haya estaciones registradas, aparecerán aquí."
              : "Cambia la búsqueda o los filtros para ver más estaciones."}
          </p>

          {stations.length > 0 && hasActiveFilters && (
            <Button
              type="button"
              variant="ghost"
              onClick={clearFilters}
              className="mt-3"
            >
              <RotateCcw className="size-4" />
              Limpiar filtros
            </Button>
          )}
        </div>
      ) : viewMode === "map" ? (
        <div className="min-h-0 flex-1">
          <StationsMap
            stations={filteredStations}
            selectedStationId={selectedStationId}
            onSelectStation={handleSelectStation}
          />
        </div>
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto">
          <StationTable stations={filteredStations} mode={mode} />
        </div>
      )}
    </div>
  );
}
