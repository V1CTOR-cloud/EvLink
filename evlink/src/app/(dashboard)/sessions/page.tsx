"use client";

import { useState } from "react";

import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { SessionCard } from "@/components/sessions/SessionCard";
import { SessionsTable } from "@/components/sessions/SessionTable";
import { SessionsViewToggle } from "@/components/sessions/SessionsViewToggle";
import { useAuth } from "@/hooks/useAuth";
import { useChargingSessions } from "@/hooks/useChargingSessions";

export default function SessionsPage() {
  const { user } = useAuth();

  const { sessions, loading, error } = useChargingSessions(
    user?.id,
  );

  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  if (loading) {
    return (
      <section className="p-6">
        <p className="text-muted-foreground">Cargando sesiones...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="p-6">
        <ErrorState message="No se pudieron cargar las sesiones." />
      </section>
    );
  }

  return (
    <section className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Mis sesiones</h1>

          <p className="mt-1 text-muted-foreground">
            Consulta tu historial de cargas.
          </p>
        </div>

        <SessionsViewToggle value={viewMode} onChange={setViewMode} />
      </div>

      {sessions.length === 0 ? (
        <EmptyState message="Todavía no tienes sesiones de carga." />
      ) : viewMode === "cards" ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
            />
          ))}
        </div>
      ) : (
        <SessionsTable sessions={sessions} />
      )}
    </section>
  );
}
