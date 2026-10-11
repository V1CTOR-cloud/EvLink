import { Euro, MapPin, Plug, Zap } from "lucide-react";

import { StatAreaChart } from "@/components/dashboard/StatAreaChart";
import { StatBarChart } from "@/components/dashboard/StatBarChart";
import type { DashboardStats as DashboardStatsType } from "@/types";

type DashboardStatsProps = {
  stats: DashboardStatsType;
};

const statsConfig = [
  {
    key: "availableStations",
    label: "Estaciones",
    icon: MapPin,
    kind: "ratio",
    decimals: 0,
    suffix: "",
  },
  {
    key: "activeSessionsCount",
    label: "Sesiones activas",
    icon: Plug,
    kind: "bar",
    series: "sessions",
    decimals: 0,
    suffix: "",
  },
  {
    key: "totalEnergy",
    label: "Energía consumida",
    icon: Zap,
    kind: "area",
    series: "energy",
    decimals: 1,
    suffix: " kWh",
  },
  {
    key: "totalSpent",
    label: "Gasto total",
    icon: Euro,
    kind: "area",
    series: "spent",
    decimals: 2,
    suffix: " €",
  },
] as const;

export function DashboardStats({ stats }: DashboardStatsProps) {
  const stationsRatio =
    stats.totalStations > 0
      ? Math.round((stats.availableStations / stats.totalStations) * 100)
      : 0;

  return (
    <section className="mt-6">
      <div className="mb-3">
        <h2 className="text-sm font-semibold">Resumen</h2>
        <p className="text-xs text-muted-foreground">Tu actividad de carga</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {statsConfig.map((item) => {
          const Icon = item.icon;
          const value = stats[item.key];

          return (
            <div
              key={item.key}
              className="group flex min-h-36 flex-col justify-between gap-3 rounded-xl border border-border bg-card p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-sm motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-[11px] text-muted-foreground">
                    {item.label}
                  </p>

                  <p className="mt-1 text-2xl font-semibold tracking-tight">
                    {value.toFixed(item.decimals)}
                    <span className="ml-0.5 text-xs font-medium text-muted-foreground">
                      {item.suffix}
                    </span>
                  </p>
                </div>

                <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted transition-colors group-hover:bg-primary/10">
                  <Icon className="size-4 text-muted-foreground transition-colors group-hover:text-primary" />
                </div>
              </div>

              {item.kind === "ratio" && (
                <div>
                  <div className="flex h-16 items-end">
                    <div
                      role="img"
                      aria-label={`${stats.availableStations} de ${stats.totalStations} estaciones con conectores libres`}
                      className="h-2 w-full overflow-hidden rounded-full bg-muted"
                    >
                      <div
                        className="bar-grow h-full rounded-full bg-primary"
                        style={{ width: `${stationsRatio}%` }}
                      />
                    </div>
                  </div>

                  <p className="mt-1 text-[11px] text-muted-foreground">
                    <span className="font-medium text-foreground">
                      {stats.availableStations} de {stats.totalStations}
                    </span>{" "}
                    con conectores libres
                  </p>
                </div>
              )}

              {item.kind === "bar" && (
                <div>
                  <StatBarChart
                    data={stats.history}
                    dataKey={item.series}
                    label="Sesiones completadas"
                  />

                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Completadas en 7 días:{" "}
                    <span className="font-medium text-foreground">
                      {stats.history.reduce(
                        (sum, point) => sum + point.sessions,
                        0,
                      )}
                    </span>
                  </p>
                </div>
              )}

              {item.kind === "area" && (
                <div>
                  <StatAreaChart
                    data={stats.history}
                    dataKey={item.series}
                    label={item.label}
                    unit={item.suffix}
                    decimals={item.decimals}
                  />

                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Últimos 7 días:{" "}
                    <span className="font-medium text-foreground">
                      {stats.history
                        .reduce((sum, point) => sum + point[item.series], 0)
                        .toFixed(item.decimals)}
                      {item.suffix}
                    </span>
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}