"use client";

import { useId } from "react";
import { Area, AreaChart } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { DashboardSeriesPoint } from "@/types";

type StatAreaChartProps = {
  data: DashboardSeriesPoint[];
  dataKey: "energy" | "spent";
  label: string;
  unit: string;
  decimals: number;
};

const formatDay = (date: string) =>
  new Date(`${date}T00:00:00`).toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });

export function StatAreaChart({
  data,
  dataKey,
  label,
  unit,
  decimals,
}: StatAreaChartProps) {
  const gradientId = `fill-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;

  const config = {
    [dataKey]: { label, color: "var(--primary)" },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={config} className="aspect-auto h-16 w-full">
      <AreaChart
        data={data}
        margin={{ top: 4, right: 0, bottom: 0, left: 0 }}
        accessibilityLayer
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stopColor={`var(--color-${dataKey})`}
              stopOpacity={0.3}
            />
            <stop
              offset="100%"
              stopColor={`var(--color-${dataKey})`}
              stopOpacity={0}
            />
          </linearGradient>
        </defs>

        <ChartTooltip
          cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
          content={
            <ChartTooltipContent
              hideIndicator
              labelFormatter={(_, payload) => {
                const date = payload?.[0]?.payload?.date;
                return date ? formatDay(date) : "";
              }}
              formatter={(value) => (
                <span className="font-medium text-foreground">
                  {Number(value).toFixed(decimals)}
                  {unit}
                </span>
              )}
            />
          }
        />

        <Area
          dataKey={dataKey}
          type="monotone"
          stroke={`var(--color-${dataKey})`}
          strokeWidth={2}
          fill={`url(#${gradientId})`}
          dot={false}
          activeDot={{ r: 3 }}
          animationDuration={900}
          animationEasing="ease-out"
        />
      </AreaChart>
    </ChartContainer>
  );
}
