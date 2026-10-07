import { Euro, MapPin, Plug, Zap } from "lucide-react";

import type { DashboardStats as DashboardStatsType } from "@/types";

type DashboardStatsProps = {
  stats: DashboardStatsType;
};

const statsConfig = [
  {
    key: "availableStations",
    label: "Estaciones",
    icon: MapPin,
    format: (value: number) => value.toString(),
    suffix: "",
  },
  {
    key: "activeSessions",
    label: "Sesiones activas",
    icon: Plug,
    format: (value: number) => value.toString(),
    suffix: "",
  },
  {
    key: "totalEnergy",
    label: "Energía consumida",
    icon: Zap,
    format: (value: number) => value.toFixed(1),
    suffix: " kWh",
  },
  {
    key: "totalSpent",
    label: "Gasto total",
    icon: Euro,
    format: (value: number) => value.toFixed(2),
    suffix: " €",
  },
] as const;

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <section className="mt-6">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold">Resumen</h2>
          <p className="text-xs text-muted-foreground">
            Tu actividad de carga
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 overflow-hidden rounded-xl border border-border bg-card xl:grid-cols-4">
        {statsConfig.map((item, index) => {
          const Icon = item.icon;
          const value = stats[item.key];

          return (
            <div
              key={item.key}
              className={[
                "group flex items-center gap-3 px-4 py-4 transition-colors hover:bg-muted/40 sm:px-5",
                index !== 0 ? "border-l border-border" : "",
                index === 2 ? "max-xl:border-l-0 max-xl:border-t" : "",
                index === 3 ? "max-xl:border-t" : "",
              ].join(" ")}
            >
              <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted transition-colors group-hover:bg-primary/10">
                <Icon className="size-4 text-muted-foreground transition-colors group-hover:text-primary" />
              </div>

              <div className="min-w-0">
                <p className="truncate text-[11px] text-muted-foreground">
                  {item.label}
                </p>

                <p className="mt-0.5 text-lg font-semibold tracking-tight">
                  {item.format(value)}
                  <span className="ml-0.5 text-xs font-medium text-muted-foreground">
                    {item.suffix}
                  </span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}