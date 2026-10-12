import { Clock3, Euro, Gauge, Zap } from "lucide-react";

import type { AdminSessionDetail } from "@/services/admin-sessions";

type AdminSessionMetricsCardProps = {
  session: AdminSessionDetail;
};

function formatDuration(startedAt: string, endedAt: string | null) {
  if (!endedAt) return "En curso";

  const minutes = Math.max(
    0,
    Math.round(
      (new Date(endedAt).getTime() - new Date(startedAt).getTime()) / 60000,
    ),
  );

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) return `${remainingMinutes} min`;
  if (remainingMinutes === 0) return `${hours} h`;

  return `${hours} h ${remainingMinutes} min`;
}

export function AdminSessionMetricsCard({
  session,
}: AdminSessionMetricsCardProps) {
  const metrics = [
    {
      label: "Energía consumida",
      value: `${session.energy_kwh.toFixed(2)} kWh`,
      icon: Zap,
    },
    {
      label: "Importe de la sesión",
      value: `${session.total_amount.toFixed(2)} €`,
      icon: Euro,
    },
    {
      label: "Precio por kWh",
      value: `${session.price_per_kwh.toFixed(3)} €/kWh`,
      icon: Gauge,
    },
    {
      label: "Duración",
      value: formatDuration(session.started_at, session.ended_at),
      icon: Clock3,
    },
  ];

  return (
    <section>
      <div className="mb-3">
        <h2 className="text-sm font-semibold">Resumen de carga</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Métricas de la sesión seleccionada
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 sm:p-5"
          >
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="mt-1 text-lg font-semibold tracking-tight">
                {value}
              </p>
            </div>

            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
              <Icon
                aria-hidden="true"
                className="size-5 text-muted-foreground"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
