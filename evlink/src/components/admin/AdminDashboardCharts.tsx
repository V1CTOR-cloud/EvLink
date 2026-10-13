"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { AdminDashboardMetrics } from "@/services/admin-dashboard";

type NetworkMetrics = AdminDashboardMetrics["stations"]["data"];
type ConnectorMetrics = AdminDashboardMetrics["connectors"]["data"];
type SessionMetrics = AdminDashboardMetrics["sessions"]["data"];

const networkConfig = {
  stations: { label: "Estaciones", color: "var(--color-chart-1)" },
  connectors: { label: "Conectores", color: "var(--color-chart-4)" },
} satisfies ChartConfig;

const sessionConfig = {
  value: { label: "Sesiones", color: "var(--color-chart-1)" },
} satisfies ChartConfig;

function NetworkStatusChart({
  stations,
  connectors,
}: {
  stations: NetworkMetrics;
  connectors: ConnectorMetrics;
}) {
  const data = [
    {
      status: "Disponible",
      stations: stations?.available ?? 0,
      connectors: connectors?.available ?? 0,
    },
    {
      status: "Ocupado",
      stations: stations?.occupied ?? 0,
      connectors: connectors?.occupied ?? 0,
    },
    {
      status: "Sin conexión",
      stations: stations?.offline ?? 0,
      connectors: connectors?.offline ?? 0,
    },
    {
      status: "Mantenimiento",
      stations: stations?.maintenance ?? 0,
      connectors: connectors?.maintenance ?? 0,
    },
  ];

  if (!stations || !connectors) {
    return (
      <p className="flex h-52 items-center justify-center text-xs text-muted-foreground">
        No hay datos suficientes para mostrar el estado de la red.
      </p>
    );
  }

  return (
    <ChartContainer
      config={networkConfig}
      className="h-56 w-full"
      aria-label="Gráfico de estados de estaciones y conectores"
      role="img"
    >
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 4, right: 12, bottom: 0, left: 0 }}
        accessibilityLayer
      >
        <CartesianGrid horizontal={false} />
        <XAxis type="number" allowDecimals={false} hide />
        <YAxis
          dataKey="status"
          type="category"
          axisLine={false}
          tickLine={false}
          width={100}
          tick={{ fontSize: 11 }}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent />}
        />
        <Bar
          dataKey="stations"
          fill="var(--color-stations)"
          radius={[0, 4, 4, 0]}
          maxBarSize={14}
        />
        <Bar
          dataKey="connectors"
          fill="var(--color-connectors)"
          radius={[0, 4, 4, 0]}
          maxBarSize={14}
        />
      </BarChart>
    </ChartContainer>
  );
}

function SessionStatusChart({ sessions }: { sessions: SessionMetrics }) {
  const data = [
    {
      status: "Pendiente",
      value: sessions?.pending ?? 0,
      fill: "var(--color-chart-1)",
    },
    {
      status: "Cargando",
      value: sessions?.charging ?? 0,
      fill: "var(--color-chart-2)",
    },
    {
      status: "Completada",
      value: sessions?.completed ?? 0,
      fill: "var(--color-chart-3)",
    },
    {
      status: "Fallida",
      value: sessions?.failed ?? 0,
      fill: "var(--destructive)",
    },
    {
      status: "Cancelada",
      value: sessions?.cancelled ?? 0,
      fill: "var(--muted-foreground)",
    },
  ];

  if (!sessions) {
    return (
      <p className="flex h-52 items-center justify-center text-xs text-muted-foreground">
        No hay datos suficientes para mostrar las sesiones.
      </p>
    );
  }

  return (
    <ChartContainer
      config={sessionConfig}
      className="h-56 w-full"
      aria-label="Gráfico de sesiones por estado"
      role="img"
    >
      <BarChart
        data={data}
        margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
        accessibilityLayer
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="status"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 10 }}
          interval={0}
        />
        <YAxis
          allowDecimals={false}
          width={30}
          axisLine={false}
          tickLine={false}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <Bar
          dataKey="value"
          radius={[4, 4, 0, 0]}
          maxBarSize={36}
        >
          {data.map((entry) => (
            <Cell key={entry.status} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}

export function AdminDashboardCharts({
  stations,
  connectors,
  sessions,
}: {
  stations: NetworkMetrics;
  connectors: ConnectorMetrics;
  sessions: SessionMetrics;
}) {
  return (
    <section aria-labelledby="admin-charts-title" className="mt-6">
      <div className="mb-3">
        <h2 id="admin-charts-title" className="text-sm font-semibold">
          Distribución de estados
        </h2>
        <p className="text-xs text-muted-foreground">
          Recuento actual por estado; no representa una tendencia temporal.
        </p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="min-w-0 overflow-hidden rounded-xl border border-border bg-card">
          <header className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
            <h3 className="text-sm font-semibold">Red e infraestructura</h3>
            <div
              aria-label="Leyenda"
              role="group"
              className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground"
            >
              <span className="inline-flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-chart-1" />
                Estaciones
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-chart-4" />
                Conectores
              </span>
            </div>
          </header>
          <div className="p-4">
            <NetworkStatusChart stations={stations} connectors={connectors} />
          </div>
        </section>

        <section className="min-w-0 overflow-hidden rounded-xl border border-border bg-card">
          <header className="border-b border-border px-5 py-4">
            <h3 className="text-sm font-semibold">Sesiones de carga</h3>
          </header>
          <div className="p-4">
            <SessionStatusChart sessions={sessions} />
          </div>
        </section>
      </div>
    </section>
  );
}
