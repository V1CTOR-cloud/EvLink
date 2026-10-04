import { EmptyState } from "@/components/common/EmptyState";
import type { ChargingStationWithConnectors } from "@/services/charging-stations";
import { StationCard } from "./StationCard";

type StationsListProps = {
  stations: ChargingStationWithConnectors[];
};

export function StationsList({ stations }: StationsListProps) {
  if (stations.length === 0) {
    return <EmptyState message="No hay estaciones disponibles." />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {stations.map((station) => (
        <StationCard key={station.id} station={station} />
      ))}
    </div>
  );
}
