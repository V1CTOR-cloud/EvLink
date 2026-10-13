
import Link from "next/link";
import {
  ArrowUpRight,
  MapPin,
  TriangleAlert,
  Wrench,
} from "lucide-react";

import { formatDate } from "@/lib/format-date";
import { cn } from "@/lib/utils";
import type { AdminDashboardIncident } from "@/services/admin-dashboard";

const statusConfig = {
  offline: {
    label: "Sin conexión",
    icon: TriangleAlert,
    tone: "text-destructive",
    iconTone: "bg-destructive/10 text-destructive",
    badge: "bg-destructive/10 text-destructive",
    priority: 0,
  },
  maintenance: {
    label: "Mantenimiento",
    icon: Wrench,
    tone: "text-yellow-600",
    iconTone: "bg-yellow-500/10 text-yellow-600",
    badge: "bg-yellow-500/10 text-yellow-600",
    priority: 1,
  },
} as const;

export function IncidentRow({
  incident,
}: {
  incident: AdminDashboardIncident;
}) {
  const status = statusConfig[incident.status];
  const Icon = status.icon;

  return (
    <li>
      <Link
        href={`/admin/stations/${incident.stationId}`}
        aria-label={`Revisar ${incident.detail} de ${incident.stationName}: ${status.label}`}
        className="group flex items-center gap-3 rounded-lg border border-border bg-card p-3.5 transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-4"
      >
        <span
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-lg",
            status.iconTone,
          )}
        >
          <Icon aria-hidden="true" className="size-4" />
        </span>

        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium">
            {incident.stationName}
          </span>

          <span className="mt-1 flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin aria-hidden="true" className="size-3 shrink-0" />
            <span className="truncate">
              {incident.city} · {incident.detail}
            </span>
          </span>

          <span className="mt-1.5 block text-[11px] text-muted-foreground sm:hidden">
            Actualizado{" "}
            {formatDate(incident.updatedAt) ?? "sin fecha"}
          </span>
        </span>

        <span
          className={cn(
            "hidden shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium sm:inline-flex",
            status.badge,
          )}
        >
          {status.label}
        </span>

        <span className="shrink-0 text-right sm:hidden">
          <span
            className={cn(
              "block text-[10px] font-medium",
              status.tone,
            )}
          >
            {status.label}
          </span>
        </span>

        <span className="hidden shrink-0 text-right lg:block">
          <span className="block text-[11px] text-muted-foreground">
            Actualizado
          </span>
          <span className="mt-0.5 block text-xs tabular-nums">
            {formatDate(incident.updatedAt) ?? "Sin fecha"}
          </span>
        </span>

        <ArrowUpRight
          aria-hidden="true"
          className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      </Link>
    </li>
  );
}
