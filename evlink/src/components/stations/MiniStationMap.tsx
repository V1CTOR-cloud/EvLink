"use client";

import { useEffect, useRef } from "react";
import * as maplibregl from "maplibre-gl";
import type { Map as MapLibreMap } from "maplibre-gl";

maplibregl.setWorkerUrl("/maplibre/maplibre-gl-worker.mjs");

type MiniStationMapProps = {
  latitude: number;
  longitude: number;
  isAvailable: boolean;
};

export function MiniStationMap({
  latitude,
  longitude,
  isAvailable,
}: MiniStationMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (
      !container ||
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude) ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180 ||
      (latitude === 0 && longitude === 0)
    ) {
      return;
    }

    const map = new maplibregl.Map({
      container,
      style: "https://tiles.openfreemap.org/styles/positron",
      center: [longitude, latitude],
      zoom: 14,
      attributionControl: {
        compact: true,
      },
      interactive: true,
    });

    map.addControl(
      new maplibregl.NavigationControl({
        showCompass: false,
      }),
      "top-right",
    );

    mapRef.current = map;

    const element = document.createElement("button");

    element.type = "button";
    element.className = isAvailable
      ? "evlink-map-marker evlink-map-marker--available"
      : "evlink-map-marker evlink-map-marker--unavailable";

    element.setAttribute(
      "aria-label",
      isAvailable
        ? "Estación con conectores disponibles"
        : "Estación sin conectores disponibles",
    );

    new maplibregl.Marker({
      element,
      anchor: "center",
    })
      .setLngLat([longitude, latitude])
      .addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [latitude, longitude, isAvailable]);

  return (
    <div
      ref={containerRef}
      className="h-48 w-full overflow-hidden rounded-lg"
      role="img"
      aria-label="Mapa con la ubicación de la estación de carga"
    />
  );
}
