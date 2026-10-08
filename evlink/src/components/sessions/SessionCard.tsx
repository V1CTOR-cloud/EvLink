"use client";

import { BatteryCharging, CalendarDays, MapPin } from "lucide-react";
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
    <Card className="overflow-hidden transition-colors hover:border-primary/40">
      <Link href={`/sessions/${session.id}`} className="block">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold">
                {session.connector.station.name}
              </h3>

              <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="size-3 shrink-0" />

                <span className="truncate">
                  {session.connector.station.address},{" "}
                  {session.connector.station.city}
                </span>
              </div>
            </div>

            <Badge
              variant={sessionStatusVariants[session.status]}
              className="shrink-0 px-2 py-0.5 text-[10px]"
            >
              {sessionStatusLabels[session.status]}
            </Badge>
          </div>

          {/* Session summary */}
          <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-3">
            <div className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
              <BatteryCharging className="size-3.5 shrink-0" />

              <span>{session.connector.connector_type.toUpperCase()}</span>

              <span>·</span>

              <span>{session.connector.power_kw} kW</span>
            </div>

            <div className="flex items-center gap-4 text-right">
              <div>
                <p className="text-[10px] text-muted-foreground">Energía</p>

                <p className="text-sm font-semibold">
                  {Number(session.energy_kwh).toFixed(1)} kWh
                </p>
              </div>

              <div>
                <p className="text-[10px] text-muted-foreground">Coste</p>

                <p className="text-sm font-semibold">
                  {session.total_amount === null
                    ? "—"
                    : `${Number(session.total_amount).toFixed(2)} €`}
                </p>
              </div>
            </div>
          </div>

          {/* Date */}
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <CalendarDays className="size-3" />

            <span>
              {isActive ? `Iniciada ${formattedDate}` : formattedDate}
            </span>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
