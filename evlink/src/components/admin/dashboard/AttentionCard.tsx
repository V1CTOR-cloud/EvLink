import Link from "next/link";
import {
  ArrowUpRight,
  CircleCheck,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

type AttentionSeverity = "danger" | "warning";

type AttentionCardProps = {
  label: string;
  description: string;
  value: number | null;
  severity: AttentionSeverity;
  icon: LucideIcon;
  href?: string;
};

const attentionStyles: Record<
  AttentionSeverity,
  {
    icon: string;
    border: string;
    value: string;
  }
> = {
  danger: {
    icon: "bg-destructive/10 text-destructive",
    border: "border-destructive/20",
    value: "text-destructive",
  },
  warning: {
    icon: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    border: "border-amber-500/20",
    value: "text-amber-600 dark:text-amber-400",
  },
};

export function AttentionCard({
  label,
  description,
  value,
  severity,
  icon: Icon,
  href,
}: AttentionCardProps) {
  const hasItems = value !== null && value > 0;
  const isClickable = hasItems && Boolean(href);
  const styles = attentionStyles[severity];

  const content = (
    <div
      className={cn(
        "flex h-full flex-col rounded-xl border bg-card p-4 transition-colors",
        hasItems ? styles.border : "border-border",
        isClickable && "hover:bg-muted/50",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-lg",
            hasItems ? styles.icon : "bg-emerald-500/10 text-emerald-600",
          )}
        >
          {hasItems ? (
            <Icon aria-hidden="true" className="size-5" />
          ) : (
            <CircleCheck aria-hidden="true" className="size-5" />
          )}
        </div>

        {isClickable && (
          <ArrowUpRight
            aria-hidden="true"
            className="size-4 text-muted-foreground"
          />
        )}
      </div>

      <div className="mt-4 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium">{label}</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            {description}
          </p>
        </div>

        <span
          className={cn(
            "text-2xl font-semibold tabular-nums",
            hasItems ? styles.value : "text-foreground",
          )}
        >
          {value ?? "—"}
        </span>
      </div>
    </div>
  );

  if (!isClickable || !href) {
    return content;
  }

  return (
    <Link
      href={href}
      className="block rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      aria-label={`${label}: ${value}. ${description}`}
    >
      {content}
    </Link>
  );
}