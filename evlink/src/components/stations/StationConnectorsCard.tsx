"use client";

import { PlugZap, Zap } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";
import { useStartCharging } from "@/hooks/useStartCharging";
import type { ChargingStationWithConnectors } from "@/types";

type StationConnectorsCardProps = {
  station: ChargingStationWithConnectors;
};

const connectorLabels = {
  type_2: "Type 2",
  ccs2: "CCS2",
  chademo: "CHAdeMO",
} as const;

const connectorDescriptions = {
  type_2: "Carga AC",
  ccs2: "Carga rápida",
  chademo: "Carga rápida",
} as const;

export function StationConnectorsCard({ station }: StationConnectorsCardProps) {
  const { user } = useAuth();
  const { startCharging, loading } = useStartCharging();
  const router = useRouter();

  const availableConnectors = station.connectors.filter(
    (connector) => connector.status === "available",
  );

  const handleStartCharging = async (connectorId: string) => {
    if (!user || loading) return;

    try {
      const session = await startCharging(connectorId);

      if (!session?.id) {
        throw new Error("La sesión se ha creado, pero no tiene un ID válido.");
      }

      router.push(`/sessions/${session.id}`);
    } catch (error) {
      console.error("[StationConnectorsCard] Error:", error);

      toast.error(
        error instanceof Error ? error.message : "No se pudo iniciar la carga",
      );
    }
  };

  return (
    <section className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between px-5 py-4">
        <div>
          <h2 className="font-semibold">Conectores</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Selecciona un conector para iniciar una carga
          </p>
        </div>

        <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
          <PlugZap className="size-4 text-primary" />
        </div>
      </div>

      <div className="border-t border-border p-5">
        {station.connectors.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Esta estación no tiene conectores.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {station.connectors.map((connector) => {
              const isAvailable = connector.status === "available";
              const isOccupied = connector.status === "occupied";

              const content = (
                <>
                  <div className="flex items-start justify-between gap-3 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div
                        className={[
                          "flex size-10 items-center justify-center rounded-lg",
                          isAvailable ? "bg-primary/10" : "bg-muted",
                        ].join(" ")}
                      >
                        <Zap
                          className={[
                            "size-5",
                            isAvailable
                              ? "text-primary"
                              : "text-muted-foreground",
                          ].join(" ")}
                        />
                      </div>

                      <div>
                        <p className="text-sm font-semibold">
                          {connectorLabels[connector.connector_type]}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          {connectorDescriptions[connector.connector_type]}
                        </p>
                      </div>
                    </div>

                    <span
                      className={[
                        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium",
                        isAvailable
                          ? "bg-primary/10 text-primary"
                          : isOccupied
                            ? "bg-yellow-500/10 text-yellow-600"
                            : "bg-muted text-muted-foreground",
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "size-1.5 rounded-full",
                          isAvailable
                            ? "bg-primary"
                            : isOccupied
                              ? "bg-yellow-500"
                              : "bg-muted-foreground",
                        ].join(" ")}
                      />

                      {isAvailable
                        ? "Disponible"
                        : isOccupied
                          ? "Ocupado"
                          : "Fuera de servicio"}
                    </span>
                  </div>

                  <div className="mt-4 flex items-end justify-between border-t border-border pt-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Potencia</p>

                      <p className="mt-0.5 text-sm font-semibold">
                        {connector.power_kw} kW
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Precio</p>

                      <p className="mt-0.5 text-sm font-semibold">
                        {Number(connector.price_per_kwh).toFixed(2)} €/kWh
                      </p>
                    </div>
                  </div>
                </>
              );

              if (!isAvailable) {
                return (
                  <div
                    key={connector.id}
                    className="rounded-xl border border-border bg-card p-4"
                  >
                    {content}
                  </div>
                );
              }

              return (
                <button
                  key={connector.id}
                  type="button"
                  onClick={() =>
                    handleStartCharging(connector.id)
                  }
                  disabled={!user || loading}
                  className="rounded-xl border border-border bg-card p-4 text-left transition-colors hover:border-primary/40 hover:bg-primary/2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {content}
                </button>
              );
            })}
          </div>
        )}

        {availableConnectors.length > 0 && (
          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="size-1.5 rounded-full bg-primary" />
            {availableConnectors.length}{" "}
            {availableConnectors.length === 1
              ? "conector disponible"
              : "conectores disponibles"}
          </div>
        )}
      </div>
    </section>
  );
}
