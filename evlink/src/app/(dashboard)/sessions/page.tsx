"use client";

import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { SessionCard } from "@/components/sessions/SessionCard";
import { useAuth } from "@/hooks/useAuth";
import { useChargingSessions } from "@/hooks/useChargingSessions";

export default function SessionsPage() {
  const { user } = useAuth();

  const {
    sessions,
    loading,
    error,
    updateSession,
  } = useChargingSessions(user?.id);

  if (loading) {
    return (
      <section className="p-6">
        <p className="text-muted-foreground">
          Cargando sesiones...
        </p>
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
      <div>
        <h1 className="text-2xl font-semibold">
          Mis sesiones
        </h1>

        <p className="text-muted-foreground">
          Consulta tu historial de cargas.
        </p>
      </div>

      {sessions.length === 0 ? (
        <EmptyState message="Todavía no tienes sesiones de carga." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              onSessionUpdated={updateSession}
            />
          ))}
        </div>
      )}
    </section>
  );
}