import { MapPin, RadioTower, ShieldCheck } from "lucide-react";

import type { AdminDashboardMetrics } from "@/services/admin-dashboard";

import { NetworkHealthPanel } from "./NetworkHealthPanel";

type HealthStatus = {
  label: string;
  description: string;
  tone: "success" | "warning" | "neutral";
};

type AdminDashboardHeaderProps = {
  health: HealthStatus;
  stations: AdminDashboardMetrics["stations"]["data"];
  connectors: AdminDashboardMetrics["connectors"]["data"];
  incidentCount: number | null;
};

export function AdminDashboardHeader({
  health,
  stations,
  connectors,
  incidentCount,
}: AdminDashboardHeaderProps) {
  const availableStations = stations?.available ?? null;

  const toneStyles = {
    success: {
      dot: "bg-emerald-500",
      text: "text-emerald-600 dark:text-emerald-400",
      border: "border-emerald-500/20",
      background: "bg-emerald-500/[0.07]",
    },
    warning: {
      dot: "bg-amber-500",
      text: "text-amber-600 dark:text-amber-400",
      border: "border-amber-500/20",
      background: "bg-amber-500/[0.07]",
    },
    neutral: {
      dot: "bg-muted-foreground",
      text: "text-muted-foreground",
      border: "border-border",
      background: "bg-muted/50",
    },
  }[health.tone];

  return (
    <header className="relative isolate overflow-hidden rounded-2xl border border-border bg-card">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-24 -z-10 size-64 rounded-full bg-primary/9 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 -z-10 w-1/2 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(hsl(var(--primary) / 0.25) 0.7px, transparent 0.7px)",
          backgroundSize: "12px 12px",
          maskImage: "linear-gradient(to left, black, transparent)",
        }}
      />

      <div className="relative flex flex-col gap-5 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/[0.07] px-2.5 py-1 text-[10px] font-semibold tracking-[0.12em] text-primary">
              <RadioTower className="size-3.5" />
              EVLINK
              <span className="text-primary/50">/</span>
              CONTROL CENTER
            </span>

            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-medium ${toneStyles.border} ${toneStyles.background} ${toneStyles.text}`}
            >
              <span className={`size-1.5 rounded-full ${toneStyles.dot}`} />
              {health.label}
            </span>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Centro de control
          </h1>

          <p className="mt-1.5 max-w-lg text-sm leading-5 text-muted-foreground">
            Supervisa tu infraestructura de recarga y gestiona las operaciones
            de EvLink desde un único lugar.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-3.5 text-primary" />
              <span>Estaciones disponibles</span>
              <strong className="font-semibold text-foreground tabular-nums">
                {availableStations ?? "—"}
              </strong>
            </span>

            <span className="hidden h-3.5 w-px bg-border sm:block" />

            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-primary" />
              <span>Acceso administrativo</span>
            </span>
          </div>
        </div>

        <div className="w-full shrink-0 lg:w-82.5 xl:w-90">
          <NetworkHealthPanel
            health={health}
            stations={stations}
            connectors={connectors}
            incidentCount={incidentCount}
          />
        </div>
      </div>
    </header>
  );
}
