"use client";

import {
  BatteryCharging,
  CalendarDays,
  Eye,
  MapPin,
  MoreVertical,
  SquareStop,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { ChargingSession } from "@/types";
import { formatDate } from "@/lib/format-date";
import {
  isSessionActive,
  sessionStatusLabels,
  sessionStatusVariants,
} from "@/lib/session-utils";
import { StopChargingDialog } from "./StopChargingDialog";

type SessionCardProps = {
  session: ChargingSession;
  onSessionUpdated: (session: ChargingSession) => void;
};

export function SessionCard({ session, onSessionUpdated }: SessionCardProps) {
  const router = useRouter();

  const [stopDialogOpen, setStopDialogOpen] = useState(false);

  const isActive = isSessionActive(session.status);
  const formattedDate = formatDate(session.created_at);

  const handleMenuClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleStopCharging = () => {
    setStopDialogOpen(true);
  };

  return (
    <>
      <Card className="overflow-hidden transition-colors hover:border-primary/40">
        <div className="relative">
          <Link href={`/sessions/${session.id}`} className="block">
            <CardContent className="p-4 pr-14">
              {/* Header */}
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

          {/* Actions */}
          <div className="absolute right-3 top-3" onClick={handleMenuClick}>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button
                    type="button"
                    aria-label="Opciones de la sesión"
                    className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <MoreVertical className="size-4" />
                  </button>
                }
              />

              <DropdownMenuContent align="end" className="w-44 p-1.5">
                <DropdownMenuItem
                  onClick={() => router.push(`/sessions/${session.id}`)}
                  className="gap-2.5 px-3 py-2.5"
                >
                  <Eye className="size-4 text-muted-foreground" />

                  <div className="flex flex-col">
                    <span className="text-sm font-medium">Ver detalle</span>

                    <span className="text-[11px] text-muted-foreground">
                      Información de la sesión
                    </span>
                  </div>
                </DropdownMenuItem>

                {isActive && (
                  <>
                    <div className="my-1 h-px bg-border" />

                    <DropdownMenuItem
                      onClick={handleStopCharging}
                      className="gap-2.5 px-3 py-2.5 text-destructive focus:bg-destructive/10 focus:text-destructive hover:text-destructive"
                    >
                      <SquareStop className="size-4" />

                      <div className="flex flex-col group">
                        <span className="text-sm font-medium">
                          Finalizar carga
                        </span>

                        <span className="text-[11px] text-destructive">
                          Detener esta sesión
                        </span>
                      </div>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </Card>

      <StopChargingDialog
        sessionId={session.id}
        onSessionUpdated={onSessionUpdated}
        open={stopDialogOpen}
        onOpenChange={setStopDialogOpen}
      />
    </>
  );
}
