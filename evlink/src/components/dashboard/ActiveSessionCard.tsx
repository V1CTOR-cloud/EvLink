import { ArrowUpRight, BatteryCharging, MapPin } from "lucide-react";

import type { DashboardActiveSession } from "@/types";
import Link from "next/link";

type ActiveSessionCardProps = {
  session: DashboardActiveSession;
};

export function ActiveSessionCard({ session }: ActiveSessionCardProps) {
  const { connector, status } = session;

  const isCharging = status === "charging";

  return (
    <section className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold">Sesión activa</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Tu vehículo está conectado
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
          <span className="size-1.5 animate-pulse rounded-full bg-primary" />
          {isCharging ? "Cargando" : "Pendiente"}
        </span>
      </div>

      <div className="grid gap-5 p-5 sm:grid-cols-2">
        <div className="flex items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <MapPin className="size-4 text-primary" />
          </div>

          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Estación</p>
            <p className="mt-1 truncate text-sm font-medium">
              {connector.station.name}
            </p>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {connector.station.address}, {connector.station.city}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <BatteryCharging className="size-4 text-primary" />
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Conector</p>
            <p className="mt-1 text-sm font-medium">
              {connector.connector_type.toUpperCase()}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {connector.power_kw} kW
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-border px-5 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium">Sesión en curso</p>

            <p className="mt-0.5 text-xs text-muted-foreground">
              Consulta y gestiona tu sesión desde el historial.
            </p>
          </div>

          <Link
            href={`/sessions/${session.id}`}
            className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-xs font-medium transition-colors hover:border-primary/30 hover:bg-primary/5"
          >
            Ver sesión
            <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
