import { Euro, MapPin, Plug, Zap } from "lucide-react";

import { StatAreaChart } from "@/components/dashboard/StatAreaChart";
import type { DashboardStats as DashboardStatsType } from "@/types";

type DashboardStatsProps = {
  stats: DashboardStatsType;
};

const statsConfig = [
  {
    key: "availableStations",
    label: "Estaciones",
    caption: "disponibles ahora",
    icon: MapPin,
    decimals: 0,
    suffix: "",
  },
  {
    key: "activeSessionsCount",
    label: "Sesiones activas",
    caption: "en curso",
    icon: Plug,
    decimals: 0,
    suffix: "",
  },
  {
    key: "totalEnergy",
    label: "Energía consumida",
    icon: Zap,
    series: "energy",
    decimals: 1,
    suffix: " kWh",
  },
  {
    key: "totalSpent",
    label: "Gasto total",
    icon: Euro,
    series: "spent",
    decimals: 2,
    suffix: " €",
  },
] as const;

export function DashboardStats({ stats }: DashboardStatsProps) {
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
          const hasSeries = "series" in item;

          const weekTotal = hasSeries
            ? stats.history.reduce((sum, point) => sum + point[item.series], 0)
            : 0;

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

              {hasSeries ? (
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
                      {weekTotal.toFixed(item.decimals)}
                      {item.suffix}
                    </span>
                  </p>
                </div>
              ) : (
                <p className="text-[11px] text-muted-foreground">
                  {item.caption}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}