import { Badge } from "@/components/ui/badge";
import type { Connector } from "@/types";

type ConnectorItemProps = {
  connector: Connector;
};

const connectorLabels = {
  type_2: "Type 2",
  ccs2: "CCS2",
  chademo: "CHAdeMO",
} as const;

const connectorStatusLabels = {
  available: "Disponible",
  occupied: "Ocupado",
  offline: "Fuera de servicio",
} as const;

export function ConnectorItem({ connector }: ConnectorItemProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="font-medium">
          {connectorLabels[connector.connector_type]}
        </p>

        <p className="text-sm text-muted-foreground">
          {connector.power_kw} kW · {connector.price_per_kwh.toFixed(2)} €/kWh
        </p>
      </div>

      <Badge variant="outline">{connectorStatusLabels[connector.status]}</Badge>
    </div>
  );
}
