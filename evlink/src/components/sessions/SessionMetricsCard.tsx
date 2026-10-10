import { Clock3, Euro, Gauge, Zap } from "lucide-react";

import { MetricRadial } from "@/components/sessions/MetricRadial";
import type { ChargingSessionDetail } from "@/types";

type SessionMetricsCardProps = {
  session: ChargingSessionDetail;
};

// Escalas visuales del anillo. NO son límites de negocio.
const REFERENCE_ENERGY_KWH = 50;
const REFERENCE_AMOUNT_EUR = 50;
const REFERENCE_POWER_KW = 350;
const REFERENCE_DURATION_MIN = 120;

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

const toProgress = (value: number, reference: number) =>
  Math.min((value / reference) * 100, 100);

function getDurationProgress(startedAt: string, endedAt: string | null) {
  const minutes = getDurationMinutes(startedAt, endedAt);

  if (minutes === null) {
    return 100;
  }

  return toProgress(minutes, REFERENCE_DURATION_MIN);
}

export function SessionMetricsCard({ session }: SessionMetricsCardProps) {
  const metrics = [
    {
      label: "Energía",
      value: formatEnergy(session.energy_kwh),
      icon: Zap,
      progress: toProgress(session.energy_kwh, REFERENCE_ENERGY_KWH),
    },
    {
      label: "Coste",
      value: formatAmount(session.total_amount),
      icon: Euro,
      progress: toProgress(session.total_amount ?? 0, REFERENCE_AMOUNT_EUR),
    },
    {
      label: "Potencia",
      value: `${session.connector.power_kw} kW`,
      icon: Gauge,
      progress: toProgress(session.connector.power_kw, REFERENCE_POWER_KW),
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

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <div
              key={metric.label}
              className="group flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-sm motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-5"
            >
              <div className="min-w-0">
                <p className="truncate text-[11px] text-muted-foreground">
                  {metric.label}
                </p>

                <p className="mt-1 truncate text-xl font-semibold tracking-tight">
                  {metric.value}
                </p>
              </div>

              <MetricRadial
                progress={metric.progress}
                label={`${metric.label}: ${metric.value}`}
              >
                <Icon className="size-4" />
              </MetricRadial>
            </div>
          );
        })}
      </div>
    </section>
  );
}