type NetworkMeterProps = {
  label: string;
  value: number | null;
  total: number | null;
  totalSuffix?: string;
};

export function NetworkMeter({
  label,
  value,
  total,
  totalSuffix = "unidades",
}: NetworkMeterProps) {
  const hasData =
    value !== null &&
    total !== null &&
    Number.isFinite(value) &&
    Number.isFinite(total) &&
    total > 0;

  const percentage = hasData
    ? Math.min(100, Math.max(0, Math.round((value / total) * 100)))
    : null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm text-muted-foreground">{label}</span>

        <span className="text-sm font-medium tabular-nums">
          {value ?? "—"}
          <span className="text-muted-foreground"> / {total ?? "—"}</span>
        </span>
      </div>

      <div
        className="h-2 overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percentage ?? undefined}
      >
        <div
          className="h-full rounded-full bg-primary transition-[width]"
          style={{ width: `${percentage ?? 0}%` }}
        />
      </div>

      <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
        <span>
          {percentage === null ? "Sin datos suficientes" : `${percentage}%`}
        </span>
        <span>{totalSuffix}</span>
      </div>
    </div>
  );
}
