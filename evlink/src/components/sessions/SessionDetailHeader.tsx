import { ArrowLeft, CalendarDays, Plug } from "lucide-react";
import Link from "next/link";

import type { ChargingSessionDetail } from "@/types";
import { SessionDetailActions } from "./SessionDetailActions";

type SessionDetailHeaderProps = {
  session: ChargingSessionDetail;
};

const statusLabels: Record<ChargingSessionDetail["status"], string> = {
  pending: "Pendiente",
  charging: "Cargando",
  completed: "Completada",
  cancelled: "Cancelada",
  failed: "Fallida",
};

const statusClasses: Record<ChargingSessionDetail["status"], string> = {
  pending: "bg-yellow-500/10 text-yellow-600",
  charging: "bg-primary/10 text-primary",
  completed: "bg-green-500/10 text-green-600",
  cancelled: "bg-muted text-muted-foreground",
  failed: "bg-destructive/10 text-destructive",
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

function formatTime(date: string) {
  return new Intl.DateTimeFormat("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function SessionDetailHeader({ session }: SessionDetailHeaderProps) {
  return (
    <div className="space-y-6">
      <Link
        href="/sessions"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Volver a sesiones
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <Plug className="size-5 text-primary" />
            </div>

            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                {session.connector.station.name}
              </h1>

              <p className="mt-1 text-sm text-muted-foreground">
                {session.connector.station.address},{" "}
                {session.connector.station.city}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={[
              "inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium",
              statusClasses[session.status],
            ].join(" ")}
          >
            {session.status === "charging" && (
              <span className="size-1.5 animate-pulse rounded-full bg-current" />
            )}

            {statusLabels[session.status]}
          </span>

          {(session.status === "pending" || session.status === "charging") && (
            <SessionDetailActions sessionId={session.id} />
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <CalendarDays className="size-4" />

          <span>
            {formatDate(session.created_at)} · {formatTime(session.created_at)}
          </span>
        </div>

        <span className="text-border">|</span>

        <span className="font-mono text-xs">ID: {session.id}</span>
      </div>
    </div>
  );
}
