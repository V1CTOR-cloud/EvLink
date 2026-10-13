"use client";

import { Pie, PieChart } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

export type SegmentTone = "success" | "warning" | "danger" | "neutral" | "brand";

export type Segment = {
  label: string;
  value: number | null;
  tone: SegmentTone;
};

// Misma paleta que las píldoras de estado de la app. Los valores de respaldo
// (hex) evitan un sector transparente si la variable del tema no se emitiera.
const toneColors: Record<SegmentTone, string> = {
  success: "var(--color-green-500, #22c55e)",
  warning: "var(--color-yellow-500, #eab308)",
  danger: "var(--destructive)",
  neutral: "color-mix(in oklab, var(--muted-foreground) 40%, transparent)",
  brand: "var(--primary)",
};

type DonutDatum = {
  tone: string;
  label: string;
  value: number;
  fill: string;
};

type StatusBreakdownProps = {
  /** Un solo segmento por tono dentro de la misma tarjeta. */
  segments: Segment[];
};

export function StatusBreakdown({ segments }: StatusBreakdownProps) {
  const slices: DonutDatum[] = segments.flatMap((segment) =>
    segment.value !== null && segment.value > 0
      ? [
          {
            tone: segment.tone,
            label: segment.label,
            value: segment.value,
            fill: `var(--color-${segment.tone})`,
          },
        ]
      : [],
  );

  const total = slices.reduce((sum, slice) => sum + slice.value, 0);

  const config: ChartConfig = {};
  segments.forEach((segment) => {
    config[segment.tone] = {
      label: segment.label,
      color: toneColors[segment.tone],
    };
  });

  // Sin datos: anillo vacío en gris, sin tooltip.
  const emptyRing: DonutDatum[] = [
    { tone: "empty", label: "Sin datos", value: 1, fill: "var(--muted)" },
  ];

  return (
    <div className="flex items-center gap-4">
      {/* Decorativo: la información accesible es la leyenda de al lado. */}
      <ChartContainer
        config={config}
        aria-hidden="true"
        className="aspect-square size-18 shrink-0"
      >
        <PieChart>
          {total > 0 && (
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value, _name, item) => {
                    const datum = item.payload as DonutDatum;

                    return (
                      <div className="flex w-full items-center justify-between gap-3">
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                          <span
                            className="size-2 rounded-full"
                            style={{ backgroundColor: datum.fill }}
                          />
                          {datum.label}
                        </span>

                        <span className="font-medium tabular-nums text-foreground">
                          {Number(value).toLocaleString("es-ES")}
                        </span>
                      </div>
                    );
                  }}
                />
              }
            />
          )}

          <Pie
            data={total > 0 ? slices : emptyRing}
            dataKey="value"
            nameKey="tone"
            innerRadius="68%"
            outerRadius="100%"
            paddingAngle={slices.length > 1 ? 3 : 0}
            cornerRadius={3}
            strokeWidth={0}
            startAngle={90}
            endAngle={-270}
            animationDuration={900}
            animationEasing="ease-out"
          />
        </PieChart>
      </ChartContainer>

      <ul className="min-w-0 flex-1 space-y-1">
        {segments.map((segment) => (
          <li
            key={segment.tone}
            className="flex items-center justify-between gap-2 text-[11px]"
          >
            <span className="flex min-w-0 items-center gap-1.5 text-muted-foreground">
              <span
                aria-hidden="true"
                className="size-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: toneColors[segment.tone] }}
              />
              <span className="truncate">{segment.label}</span>
            </span>

            <span className="font-medium tabular-nums text-foreground">
              {segment.value === null
                ? "—"
                : segment.value.toLocaleString("es-ES")}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}