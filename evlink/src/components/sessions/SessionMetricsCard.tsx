import { Clock3, Euro, Gauge, Zap } from "lucide-react";

import type { ChargingSessionDetail } from "@/types";

type SessionMetricsCardProps = {
  session: ChargingSessionDetail;
};

function formatEnergy(energy: number) {
  return `${Number(energy).toFixed(1)} kWh`;
}

function formatAmount(amount: number | null) {
  if (amount === null) {
    return "—";
  }

  return `${Number(amount).toFixed(2)} €`;
}

function getDurationMinutes(startedAt: string, endedAt: string | null) {
  if (!endedAt) {
    return null;
  }

  const start = new Date(startedAt).getTime();
  const end = new Date(endedAt).getTime();

  return Math.max(0, Math.round((end - start) / 60000));
}

function formatDuration(startedAt: string, endedAt: string | null) {
  const minutes = getDurationMinutes(startedAt, endedAt);

  if (minutes === null) {
    return "En curso";
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${remainingMinutes} min`;
  }

  if (remainingMinutes === 0) {
    return `${hours} h`;
  }

  return `${hours} h ${remainingMinutes} min`;
}

function getEnergyProgress(energy: number) {
  return Math.min((energy / 50) * 100, 100);
}

function getPowerProgress(power: number) {
  return Math.min((power / 350) * 100, 100);
}

function getDurationProgress(startedAt: string, endedAt: string | null) {
  const minutes = getDurationMinutes(startedAt, endedAt);

  if (minutes === null) {
    return 100;
  }

  return Math.min((minutes / 120) * 100, 100);
}

export function SessionMetricsCard({ session }: SessionMetricsCardProps) {
  const metrics = [
    {
      label: "Energía",
      value: formatEnergy(session.energy_kwh),
      icon: Zap,
      progress: getEnergyProgress(session.energy_kwh),
    },
    {
      label: "Coste",
      value: formatAmount(session.total_amount),
      icon: Euro,
      progress: Math.min(((session.total_amount ?? 0) / 50) * 100, 100),
    },
    {
      label: "Potencia",
      value: `${session.connector.power_kw} kW`,
      icon: Gauge,
      progress: getPowerProgress(session.connector.power_kw),
    },
    {
      label: "Duración",
      value: formatDuration(session.started_at, session.ended_at),
      icon: Clock3,
      progress: getDurationProgress(session.started_at, session.ended_at),
    },
  ];

  return (
    <section>
      <div className="mb-3">
        <h2 className="text-sm font-semibold">Resumen de carga</h2>

        <p className="mt-1 text-xs text-muted-foreground">
          Principales métricas de esta sesión
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <div
              key={metric.label}
              className="rounded-xl border border-border bg-card p-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Icon className="size-4" />

                  <span className="text-xs font-medium">{metric.label}</span>
                </div>
              </div>

              <p className="mt-4 text-xl font-semibold tracking-tight">
                {metric.value}
              </p>

              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{
                    width: `${metric.progress}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
