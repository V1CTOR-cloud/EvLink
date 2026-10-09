"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { List, Map as MapIcon } from "lucide-react";

import { StationsList } from "@/components/stations/StationsList";
import { StationCard } from "@/components/stations/StationCard";
import type { ChargingStationWithConnectors } from "@/types";

const StationsMap = dynamic(
  () =>
    import("@/components/stations/StationsMap").then(
      (module) => module.StationsMap,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-150 w-full animate-pulse rounded-2xl border bg-muted/30" />
    ),
  },
);

type StationsExplorerProps = {
  stations: ChargingStationWithConnectors[];
};

type ViewMode = "map" | "list";

export function StationsExplorer({ stations }: StationsExplorerProps) {
  const [selectedStationId, setSelectedStationId] = useState<string | null>(
    null,
  );
  const [viewMode, setViewMode] = useState<ViewMode>("map");

  function handleSelectStation(stationId: string) {
    const station = stations.find((item) => item.id === stationId);

    if (!station) return;

    setSelectedStationId(stationId);

    toast.custom(
      (toastId) => (
        <StationCard
          station={station}
          variant="compact"
          onClose={() => {
            toast.dismiss(toastId);
            setSelectedStationId(null);
          }}
        />
      ),
      {
        id: "selected-station",
        duration: Infinity,
        position: "bottom-right",
        unstyled: true,
        className: "!bg-transparent !border-0 !p-0 !shadow-none m-6",
      },
    );
  }

  function handleViewChange(mode: ViewMode) {
    setViewMode(mode);

    if (mode === "list") {
      toast.dismiss("selected-station");
      setSelectedStationId(null);
    }
  }

  useEffect(() => {
    return () => {
      toast.dismiss("selected-station");
    };
  }, []);

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <div className="flex shrink-0 items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {stations.length} {stations.length === 1 ? "estación" : "estaciones"}
        </p>

        <div className="inline-flex rounded-lg border bg-card p-1">
          <button
            type="button"
            onClick={() => handleViewChange("map")}
            aria-pressed={viewMode === "map"}
            className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
              viewMode === "map"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <MapIcon className="size-4" />
            Mapa
          </button>

          <button
            type="button"
            onClick={() => handleViewChange("list")}
            aria-pressed={viewMode === "list"}
            className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
              viewMode === "list"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <List className="size-4" />
            Listado
          </button>
        </div>
      </div>

      {viewMode === "map" ? (
        <div className="min-h-0 flex-1">
          <StationsMap
            stations={stations}
            selectedStationId={selectedStationId}
            onSelectStation={handleSelectStation}
          />
        </div>
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto">
          <StationsList stations={stations} />
        </div>
      )}
    </div>
  );
}
