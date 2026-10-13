import type { ChargingStationWithConnectors } from "@/types";

export type StationAvailabilityKey = "available" | "occupied" | "unavailable";

export const stationAvailabilityLabels: Record<StationAvailabilityKey, string> =
  {
    available: "Disponible",
    occupied: "Ocupada",
    unavailable: "Sin disponibilidad",
  };

/**
 * Disponibilidad de una estación a partir del estado de sus conectores:
 * disponible si alguno está libre, ocupada si ninguno lo está pero alguno
 * está en uso, y sin disponibilidad en cualquier otro caso.
 */
export function getStationAvailability(
  station: ChargingStationWithConnectors,
) {
  const availableConnectors = station.connectors.filter(
    (connector) => connector.status === "available",
  );

  const hasOccupiedConnectors = station.connectors.some(
    (connector) => connector.status === "occupied",
  );

  const key: StationAvailabilityKey =
    availableConnectors.length > 0
      ? "available"
      : hasOccupiedConnectors
        ? "occupied"
        : "unavailable";

  return {
    key,
    availableConnectors,
    totalConnectors: station.connectors.length,
  };
}