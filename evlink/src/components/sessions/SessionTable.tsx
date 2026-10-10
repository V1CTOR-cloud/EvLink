"use client";

import { CalendarDays, Plug, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

import type { ChargingSession } from "@/types";

type SessionsTableProps = {
  sessions: ChargingSession[];
};

const statusLabels: Record<ChargingSession["status"], string> = {
  pending: "Pendiente",
  charging: "Cargando",
  completed: "Completada",
  cancelled: "Cancelada",
  failed: "Fallida",
};

const statusClasses: Record<ChargingSession["status"], string> = {
  pending: "bg-yellow-500/10 text-yellow-600",
  charging: "bg-primary/10 text-primary",
  completed: "bg-green-500/10 text-green-600",
  cancelled: "bg-muted text-muted-foreground",
  failed: "bg-destructive/10 text-destructive",
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function formatTime(date: string) {
  return new Intl.DateTimeFormat("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function formatEnergy(energy: number | null) {
  if (energy === null) {
    return "—";
  }

  return `${Number(energy).toFixed(1)} kWh`;
}

function formatAmount(amount: number | null) {
  if (amount === null) {
    return "—";
  }

  return `${Number(amount).toFixed(2)} €`;
}

export function SessionsTable({ sessions }: SessionsTableProps) {
  const router = useRouter();

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-225 text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/20">
              <th className="px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Fecha
              </th>

              <th className="px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Estación
              </th>

              <th className="px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Conector
              </th>

              <th className="px-5 py-3.5 text-right text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Energía
              </th>

              <th className="px-5 py-3.5 text-right text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Importe
              </th>

              <th className="px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Estado
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border/70">
            {sessions.map((session) => {
              const { connector } = session;

              return (
                <tr
                  key={session.id}
                  role="link"
                  tabIndex={0}
                  onClick={() => router.push(`/sessions/${session.id}`)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      router.push(`/sessions/${session.id}`);
                    }
                  }}
                  className="group cursor-pointer transition-colors hover:bg-muted/20 focus-visible:bg-muted/20 focus-visible:outline-none"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted/70">
                        <CalendarDays className="size-3.5 text-muted-foreground" />
                      </div>

                      <div>
                        <p className="text-sm font-medium">
                          {formatDate(session.created_at)}
                        </p>

                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {formatTime(session.created_at)}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10">
                        <MapPin className="size-3.5 text-primary" />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {connector.station.name}
                        </p>

                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                          {connector.station.address}, {connector.station.city}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted/70">
                        <Plug className="size-3.5 text-muted-foreground" />
                      </div>

                      <div>
                        <p className="text-sm font-medium">
                          {connector.connector_type.toUpperCase()}
                        </p>

                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {connector.power_kw} kW
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-right">
                    <span className="text-sm font-medium">
                      {formatEnergy(session.energy_kwh)}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-right">
                    <span className="text-sm font-semibold">
                      {formatAmount(session.total_amount)}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={[
                        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium",
                        statusClasses[session.status],
                      ].join(" ")}
                    >
                      {session.status === "charging" && (
                        <span className="size-1.5 animate-pulse rounded-full bg-current" />
                      )}

                      {statusLabels[session.status]}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
