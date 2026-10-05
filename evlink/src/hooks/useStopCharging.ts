"use client";

import { useState } from "react";

import { createClient } from "@/lib/supabase/client";
import { stopCharging } from "@/services/charging-sessions";

export function useStopCharging() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [supabase] = useState(() => createClient());

    const finishCharging = async (
        sessionId: string,
        energyKwh: number,
    ) => {
        try {
            setLoading(true);
            setError(null);

            const session = await stopCharging(
                supabase,
                sessionId,
                energyKwh,
            );

            return session;
        } catch (error) {
            const normalizedError =
                error instanceof Error
                    ? error
                    : new Error("No se pudo finalizar la carga");

            setError(normalizedError);
            throw normalizedError;
        } finally {
            setLoading(false);
        }
    };

    return {
        finishCharging,
        loading,
        error,
    };
}