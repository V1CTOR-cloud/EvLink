import { Plug, MapPin, Zap } from "lucide-react";

import type { ChargingSessionDetail } from "@/types";

type SessionLocationCardProps = {
  session: ChargingSessionDetail;
};

const connectorLabels: Record<
  ChargingSessionDetail["connector"]["connector_type"],
  string
> = {
  type_2: "Type 2",
  ccs2: "CCS2",
  chademo: "CHAdeMO",
};

export function SessionLocationCard({ session }: SessionLocationCardProps) {
  const { connector } = session;
  const { station } = connector;

  return (
    <section className="rounded-xl border border-border bg-card">
      <div className="border-b border-border px-5 py-4">
        <h2 className="text-sm font-semibold">Ubicación de la carga</h2>

        <p className="mt-1 text-xs text-muted-foreground">
          Estación y conector utilizados
        </p>
      </div>

      <div className="grid divide-y divide-border md:grid-cols-2 md:divide-x md:divide-y-0">
        <div className="p-5">
          <div className="flex items-start gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <MapPin className="size-4 text-primary" />
            </div>

            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Estación</p>

              <p className="mt-1 font-medium">{station.name}</p>

              <p className="mt-1 text-sm text-muted-foreground">
                {station.address}
              </p>

              <p className="text-sm text-muted-foreground">{station.city}</p>
            </div>
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-start gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
              <Plug className="size-4 text-muted-foreground" />
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Conector</p>

              <p className="mt-1 font-medium">
                {connectorLabels[connector.connector_type]}
              </p>

              <div className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                <Zap className="size-3.5" />

                <span>{connector.power_kw} kW</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
