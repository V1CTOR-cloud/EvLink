
"use client";

import {
  BatteryCharging,
  CalendarDays,
  MapPin,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import type { ChargingSession } from "@/types";
import { formatDate } from "@/lib/format-date";
import {
  isSessionActive,
  sessionStatusLabels,
  sessionStatusVariants,
} from "@/lib/session-utils";

type SessionCardProps = {
  session: ChargingSession;
};

export function SessionCard({ session }: SessionCardProps) {
  const isActive = isSessionActive(session.status);
  const formattedDate = formatDate(session.created_at);

  return (
    <Card className="group overflow-hidden transition-all duration-200 hover:border-primary/40 hover:shadow-sm">
      <Link
        href={`/sessions/${session.id}`}
        className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
        aria-label={`Ver sesión en ${session.connector.station.name}`}
      >
        <CardContent className="p-3 sm:p-3.5">
          {/* Station and status */}
          <div className="flex items-start justify-between gap-2.5">
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-semibold leading-5">
                {session.connector.station.name}
              </h3>

              <div className="mt-1 flex min-w-0 items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="size-3 shrink-0" />
                <span className="truncate">
                  {session.connector.station.address},{" "}
                  {session.connector.station.city}
                </span>
              </div>
            </div>

            <Badge
              variant={sessionStatusVariants[session.status]}
              className="shrink-0 px-1.5 py-0 text-[10px] leading-5"
            >
              {sessionStatusLabels[session.status]}
            </Badge>
          </div>

          {/* Session metrics */}
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-md bg-muted/50 px-2.5 py-2">
              <p className="text-[10px] text-muted-foreground">
                Energía
              </p>
              <p className="mt-0.5 text-sm font-semibold tabular-nums">
                {Number(session.energy_kwh).toFixed(1)}{" "}
                <span className="text-xs font-normal text-muted-foreground">
                  kWh
                </span>
              </p>
            </div>

            <div className="rounded-md bg-muted/50 px-2.5 py-2">
              <p className="text-[10px] text-muted-foreground">
                Coste
              </p>
              <p className="mt-0.5 text-sm font-semibold tabular-nums">
                {session.total_amount === null
                  ? "—"
                  : `${Number(session.total_amount).toFixed(2)} €`}
              </p>
            </div>
          </div>

          {/* Connector and date */}
          <div className="mt-2.5 flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-1.5 text-[11px] text-muted-foreground">
              <BatteryCharging className="size-3.5 shrink-0" />
              <span className="truncate">
                {session.connector.connector_type.toUpperCase()}
                {" · "}
                {session.connector.power_kw} kW
              </span>
            </div>

            <div className="flex shrink-0 items-center gap-1 text-[10px] text-muted-foreground">
              <CalendarDays className="size-3" />
              <span>{isActive ? `Iniciada ${formattedDate}` : formattedDate}</span>
              <ArrowUpRight className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
