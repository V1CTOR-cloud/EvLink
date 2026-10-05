import type { ChargingSession } from "@/types";
import { connectorTypeLabels } from "@/lib/session-utils";

type SessionLocationProps = {
  connector: ChargingSession["connector"];
};

export function SessionLocation({ connector }: SessionLocationProps) {
  return (
    <div className="space-y-1">

      <p className="text-sm text-muted-foreground">
        {connector.station.address}, {connector.station.city}
      </p>

      <p className="text-sm text-muted-foreground">
        {connectorTypeLabels[connector.connector_type]} · {connector.power_kw}{" "}
        kW
      </p>
    </div>
  );
}
