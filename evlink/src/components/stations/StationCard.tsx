import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import type { ChargingStationWithConnectors } from "@/services/charging-stations";
import { ConnectorItem } from "./ConnectorItem";

type StationCardProps = {
  station: ChargingStationWithConnectors;
};

export function StationCard({ station }: StationCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{station.name}</CardTitle>
      </CardHeader>

      <div className="space-y-3">
        {station.connectors.length > 0 ? (
          station.connectors.map((connector) => (
            <ConnectorItem key={connector.id} connector={connector} />
          ))
        ) : (
          <p className="text-sm text-muted-foreground">
            No hay conectores disponibles.
          </p>
        )}
      </div>
    </Card>
  );
}
