"use client";

import { useEffect, useRef, useState } from "react";
import * as maplibregl from "maplibre-gl";
import type { Map as MapLibreMap, Marker as MapLibreMarker } from "maplibre-gl";
maplibregl.setWorkerUrl("/maplibre/maplibre-gl-worker.mjs");
import type { ChargingStationWithConnectors } from "@/types";

type StationsMapProps = {
  stations: ChargingStationWithConnectors[];
  selectedStationId: string | null;
  onSelectStation: (stationId: string) => void;
};

function isStationAvailable(station: ChargingStationWithConnectors) {
  return station.connectors.some(
    (connector) => connector.status === "available",
  );
}

function hasValidCoordinates(station: ChargingStationWithConnectors) {
  const { latitude, longitude } = station;

  return (
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180 &&
    !(latitude === 0 && longitude === 0)
  );
}

export function StationsMap({
  stations,
  selectedStationId,
  onSelectStation,
}: StationsMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markersRef = useRef<
    { id: string; marker: MapLibreMarker; element: HTMLButtonElement }[]
  >([]);
  const onSelectRef = useRef(onSelectStation);
  const [mapLoaded, setMapLoaded] = useState(false);

  onSelectRef.current = onSelectStation;

  // Inicializamos el mapa una sola vez.
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: "https://tiles.openfreemap.org/styles/positron",
      center: [-0.3763, 39.4699],
      zoom: 12,
      attributionControl: {
        compact: true,
      },
    });

    map.addControl(
      new maplibregl.NavigationControl({ showCompass: false }),
      "top-right",
    );

    map.on("load", () => setMapLoaded(true));
    mapRef.current = map;

    return () => {
      markersRef.current.forEach(({ marker }) => marker.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
      setMapLoaded(false);
    };
  }, []);

  // Añadimos los marcadores de las estaciones.
  useEffect(() => {
    const map = mapRef.current;

    if (!map || !mapLoaded) return;

    markersRef.current.forEach(({ marker }) => marker.remove());
    markersRef.current = [];

    const validStations = stations.filter(hasValidCoordinates);

    validStations.forEach((station) => {
      const available = isStationAvailable(station);
      const element = document.createElement("button");

      element.type = "button";
      element.className = available
        ? "evlink-map-marker evlink-map-marker--available"
        : "evlink-map-marker evlink-map-marker--unavailable";

      element.dataset.stationId = station.id;
      element.setAttribute(
        "aria-label",
        `Seleccionar estación ${station.name}`,
      );
      element.setAttribute("aria-pressed", "false");
      element.dataset.stationId = station.id;
      element.setAttribute(
        "aria-label",
        `Seleccionar estación ${station.name}`,
      );

      element.addEventListener("click", () => {
        onSelectRef.current(station.id);
      });

      

      const marker = new maplibregl.Marker({
        element,
        anchor: "center",
      })
        .setLngLat([station.longitude, station.latitude])
        .addTo(map);

      markersRef.current.push({
        id: station.id,
        marker,
        element,
      });
    });

    if (validStations.length === 1) {
      const station = validStations[0];
      map.flyTo({
        center: [station.longitude, station.latitude],
        zoom: 14,
      });
    } else if (validStations.length > 1) {
      const bounds = new maplibregl.LngLatBounds();

      validStations.forEach((station) => {
        bounds.extend([station.longitude, station.latitude]);
      });

      map.fitBounds(bounds, {
        padding: 60,
        maxZoom: 14,
        duration: 800,
      });
    }
  }, [stations, mapLoaded]);

  // Actualizamos el aspecto del marcador seleccionado sin recrear el mapa.
  useEffect(() => {
    markersRef.current.forEach(({ id, element }) => {
      const selected = id === selectedStationId;

      element.classList.toggle("is-selected", selected);
      element.setAttribute("aria-pressed", String(selected));
    });
  }, [selectedStationId, mapLoaded]);

  const hasValidStations = stations.some(hasValidCoordinates);

  if (!hasValidStations) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-2xl border bg-muted/30 p-6 text-center text-sm text-muted-foreground">
        No hay estaciones con coordenadas válidas para mostrar en el mapa.
      </div>
    );
  }

  return (
    <div className="relative h-[450px] w-full overflow-hidden rounded-2xl border border-border shadow-sm sm:h-[550px] md:h-[650px] lg:h-[800px]">
      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
}
