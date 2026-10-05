"use client";

import { useEffect, useState } from "react";

import { createClient } from "@/lib/supabase/client";
import { getChargingSessions } from "@/services/charging-sessions";
import type { ChargingSession } from "@/types/";

export function useChargingSessions(userId?: string) {
    const [sessions, setSessions] = useState<ChargingSession[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const [supabase] = useState(() => createClient());

    const updateSession = (updatedSession: ChargingSession) => {
        setSessions((currentSessions) =>
            currentSessions.map((session) =>
                session.id === updatedSession.id
                    ? updatedSession
                    : session,
            ),
        );
    };

    useEffect(() => {
        if (!userId) {
            return;
        }

        const loadSessions = async () => {
            try {
                setLoading(true);
                setError(null);

                const data = await getChargingSessions(
                    supabase,
                    userId,
                );

                setSessions(data);
            } catch (error) {
                setError(
                    error instanceof Error
                        ? error
                        : new Error("No se pudieron obtener las sesiones"),
                );
            } finally {
                setLoading(false);
            }
        };

        loadSessions();
    }, [supabase, userId]);

    return {
        sessions,
        loading,
        error,
        updateSession
    };
}