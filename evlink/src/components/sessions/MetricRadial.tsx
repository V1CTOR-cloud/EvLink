"use client";

import type { ReactNode } from "react";
import { PolarAngleAxis, RadialBar, RadialBarChart } from "recharts";

import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { cn } from "@/lib/utils";

type MetricRadialProps = {
  progress: number; // 0-100
  label: string;
  className?: string;
  children?: ReactNode;
};

export function MetricRadial({
  progress,
  label,
  className,
  children,
}: MetricRadialProps) {
  const config = {
    progress: { label, color: "var(--primary)" },
  } satisfies ChartConfig;

  return (
    <div
      className={cn("relative size-16 shrink-0", className)}
      role="img"
      aria-label={label}
    >
      <ChartContainer config={config} className="aspect-square size-full">
        <RadialBarChart
          data={[{ name: "progress", progress }]}
          startAngle={90}
          endAngle={-270}
          innerRadius="74%"
          outerRadius="100%"
          barSize={6}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
          <RadialBar
            dataKey="progress"
            cornerRadius={10}
            fill="var(--color-progress)"
            background={{ fill: "var(--muted)" }}
            animationDuration={900}
            animationEasing="ease-out"
          />
        </RadialBarChart>
      </ChartContainer>

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-muted-foreground transition-colors group-hover:text-primary">
        {children}
      </div>
    </div>
  );
}