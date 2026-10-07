import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { ChargingSession } from "@/types";
import { formatDate } from "@/lib/format-date";
import {
  isSessionActive,
  sessionStatusLabels,
  sessionStatusVariants,
} from "@/lib/session-utils";
import { SessionLocation } from "./SessionLocation";
import { StopChargingButton } from "./StopChargingButton";
import Link from "next/link";

type SessionCardProps = {
  session: ChargingSession;
  onSessionUpdated: (session: ChargingSession) => void;
};

export function SessionCard({ session, onSessionUpdated }: SessionCardProps) {
  const formattedDate = formatDate(session.created_at);
  const formattedStart = formatDate(session.started_at);
  const formattedEnd = formatDate(session.ended_at);
  const isActive = isSessionActive(session.status);

  return (
    <Link href={`/sessions/${session.id}`} className="block">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">
            {session.connector.station.name}
          </CardTitle>

          <Badge variant={sessionStatusVariants[session.status]}>
            {sessionStatusLabels[session.status]}
          </Badge>
        </CardHeader>

        <CardContent className="space-y-2">
          <SessionLocation connector={session.connector} />

          <p className="text-sm text-muted-foreground">
            Inicio: {formattedStart}
          </p>

          <p className="text-sm text-muted-foreground">
            Fin: {formattedEnd ?? "En curso"}
          </p>

          <p className="text-sm text-muted-foreground">
            Fecha: {formattedDate}
          </p>

          {isActive ? (
            <>
              <p className="text-sm text-muted-foreground">Sesión en curso</p>

              <StopChargingButton
                sessionId={session.id}
                onSessionUpdated={onSessionUpdated}
              />
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Energía: {session.energy_kwh} kWh
              </p>

              <p className="text-sm text-muted-foreground">
                Precio: {session.price_per_kwh.toFixed(2)} €/kWh
              </p>

              <p className="font-medium">
                Total: {session.total_amount.toFixed(2)} €
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
