"use client";

import { Bar, BarChart } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { DashboardSeriesPoint } from "@/types";

type StatBarChartProps = {
  data: DashboardSeriesPoint[];
  dataKey: "sessions";
  label: string;
};

const formatDay = (date: string) =>
  new Date(`${date}T00:00:00`).toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });

export function StatBarChart({ data, dataKey, label }: StatBarChartProps) {
  const config = {
    [dataKey]: { label, color: "var(--primary)" },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={config} className="aspect-auto h-16 w-full">
      <BarChart
        data={data}
        margin={{ top: 4, right: 0, bottom: 0, left: 0 }}
        barCategoryGap="22%"
        accessibilityLayer
      >
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              hideIndicator
              labelFormatter={(_, payload) => {
                const date = payload?.[0]?.payload?.date;
                return date ? formatDay(date) : "";
              }}
              formatter={(value) => (
                <span className="font-medium text-foreground">
                  {Number(value)} {Number(value) === 1 ? "sesión" : "sesiones"}
                </span>
              )}
            />
          }
        />

        <Bar
          dataKey={dataKey}
          fill={`var(--color-${dataKey})`}
          radius={[3, 3, 3, 3]}
          background={{ fill: "var(--muted)", radius: 3 }}
          animationDuration={900}
          animationEasing="ease-out"
        />
      </BarChart>
    </ChartContainer>
  );
}
