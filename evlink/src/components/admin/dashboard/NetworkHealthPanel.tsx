import {
  Activity,
  CheckCircle2,
  CircleAlert,
  MapPin,
  Plug,
  TriangleAlert,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { AdminDashboardMetrics } from "@/services/admin-dashboard";

type HealthTone = "success" | "warning" | "neutral";

type NetworkHealthPanelProps = {
  health: {
    label: string;
    description: string;
    tone: HealthTone;
  };
  stations: AdminDashboardMetrics["stations"]["data"];
  connectors: AdminDashboardMetrics["connectors"]["data"];
  incidentCount: number | null;
};

const toneStyles = {
  success: {
    text: "text-emerald-600 dark:text-emerald-400",
    dot: "bg-emerald-500",
    bar: "bg-emerald-500",
    soft: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  warning: {
    text: "text-amber-600 dark:text-amber-400",
    dot: "bg-amber-500",
    bar: "bg-amber-500",
    soft: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  neutral: {
    text: "text-muted-foreground",
    dot: "bg-muted-foreground",
    bar: "bg-primary",
    soft: "bg-muted/70",
    border: "border-border",
  },
} satisfies Record<
  HealthTone,
  {
    text: string;
    dot: string;
    bar: string;
    soft: string;
    border: string;
  }
>;

function getPercentage(
  value: number | null,
  total: number | null,
): number | null {
  if (
    value === null ||
    total === null ||
    !Number.isFinite(value) ||
    !Number.isFinite(total) ||
    total <= 0
  ) {
    return null;
  }

  return Math.min(100, Math.max(0, Math.round((value / total) * 100)));
}

function CapacityRow({
  label,
  value,
  total,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number | null;
  total: number | null;
  icon: typeof MapPin;
  tone: HealthTone;
}) {
  const percentage = getPercentage(value, total);
  const styles = toneStyles[tone];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted/70">
            <Icon className="size-3.5 text-muted-foreground" />
          </div>

          <span className="truncate text-xs text-muted-foreground">
            {label}
          </span>
        </div>

        <span className="shrink-0 text-xs font-semibold tabular-nums">
          {value ?? "—"}
          <span className="font-normal text-muted-foreground">
            {" "}/ {total ?? "—"}
          </span>
        </span>
      </div>

      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percentage ?? undefined}
        className="h-1 overflow-hidden rounded-full bg-muted"
      >
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-500",
            styles.bar,
          )}
          style={{ width: `${percentage ?? 0}%` }}
        />
      </div>
    </div>
  );
}

export function NetworkHealthPanel({
  health,
  stations,
  connectors,
  incidentCount,
}: NetworkHealthPanelProps) {
  const operationalStations = stations?.operational ?? null;
  const totalStations = stations?.total ?? null;
  const availableConnectors = connectors?.available ?? null;
  const totalConnectors = connectors?.total ?? null;

  const stationPercentage = getPercentage(
    operationalStations,
    totalStations,
  );

  const connectorPercentage = getPercentage(
    availableConnectors,
    totalConnectors,
  );

  const validPercentages = [
    stationPercentage,
    connectorPercentage,
  ].filter((value): value is number => value !== null);

  const overallPercentage =
    validPercentages.length > 0
      ? Math.round(
          validPercentages.reduce((sum, value) => sum + value, 0) /
            validPercentages.length,
        )
      : null;

  const hasIncidents = incidentCount !== null && incidentCount > 0;
  const styles = toneStyles[health.tone];

  const HealthIcon =
    health.tone === "success"
      ? CheckCircle2
      : health.tone === "warning"
        ? CircleAlert
        : Activity;

  return (
    <section className="relative overflow-hidden rounded-xl border border-border/80 bg-background/75 p-4">
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -right-10 -top-12 size-32 rounded-full blur-3xl",
          health.tone === "success" && "bg-emerald-500/10",
          health.tone === "warning" && "bg-amber-500/10",
          health.tone === "neutral" && "bg-primary/10",
        )}
      />

      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <div
              className={cn(
                "flex size-9 shrink-0 items-center justify-center rounded-lg border",
                styles.border,
                styles.soft,
                styles.text,
              )}
            >
              <HealthIcon className="size-4" />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-medium text-muted-foreground">
                Estado de la red
              </p>

              <p className="mt-0.5 truncate text-sm font-semibold">
                {health.label}
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className={cn("text-2xl font-semibold leading-none tabular-nums", styles.text)}>
              {overallPercentage === null ? "—" : `${overallPercentage}%`}
            </p>
            <p className="mt-1 text-[10px] text-muted-foreground">
              Operatividad
            </p>
          </div>
        </div>

        <p className="mt-3 line-clamp-2 text-xs leading-5 text-muted-foreground">
          {health.description}
        </p>

        <div className="my-4 h-px bg-border/80" />

        <div className="space-y-4">
          <CapacityRow
            label="Estaciones operativas"
            value={operationalStations}
            total={totalStations}
            icon={MapPin}
            tone={health.tone}
          />

          <CapacityRow
            label="Conectores disponibles"
            value={availableConnectors}
            total={totalConnectors}
            icon={Plug}
            tone={health.tone}
          />
        </div>

        <div
          className={cn(
            "mt-4 flex items-center justify-between gap-3 rounded-lg border px-3 py-2",
            hasIncidents
              ? "border-amber-500/20 bg-amber-500/[0.06]"
              : "border-border/80 bg-muted/30",
          )}
        >
          <div className="flex min-w-0 items-center gap-2">
            <TriangleAlert
              className={cn(
                "size-3.5 shrink-0",
                hasIncidents
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-muted-foreground",
              )}
            />

            <span className="truncate text-xs text-muted-foreground">
              {hasIncidents
                ? "Incidencias pendientes"
                : "Incidencias registradas"}
            </span>
          </div>

          <span
            className={cn(
              "text-sm font-semibold tabular-nums",
              hasIncidents && "text-amber-600 dark:text-amber-400",
            )}
          >
            {incidentCount ?? "—"}
          </span>
        </div>
      </div>
    </section>
  );
}