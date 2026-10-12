import Link from "next/link";
import {
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";

import {
  StatusBreakdown,
  type Segment,
} from "@/components/admin/AdminStatusBreakdown";

type MetricCardProps = {
  title: string;
  value: number | null;
  icon: LucideIcon;
  segments: Segment[];
  href: string;
};

export function MetricCard({
  title,
  value,
  icon: Icon,
  segments,
  href,
}: MetricCardProps) {
  return (
    <Link
      href={href}
      className="group block rounded-xl border border-border bg-card p-5 outline-none transition-colors hover:bg-muted/30 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg border border-border bg-background">
          <Icon
            aria-hidden="true"
            className="size-5 text-muted-foreground"
          />
        </div>

        <ArrowUpRight
          aria-hidden="true"
          className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      </div>

      <div className="mt-4">
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="mt-1 text-3xl font-semibold tracking-tight tabular-nums">
          {value ?? "—"}
        </p>
      </div>

      <div className="mt-5 border-t border-border pt-4">
        <StatusBreakdown segments={segments} />
      </div>

      <p className="mt-4 text-xs font-medium text-muted-foreground transition-colors group-hover:text-foreground">
        Ver detalles
      </p>
    </Link>
  );
}