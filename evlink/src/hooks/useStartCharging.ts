
"use client";

import { useState } from "react";

import { createClient } from "@/lib/supabase/client";
import { createChargingSession } from "@/services/charging-sessions";

export function useStartCharging() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const [supabase] = useState(() => createClient());

    const startCharging = async (
        connectorId: string,
    ) => {
        try {
            setLoading(true);
            setError(null);

            const session = await createChargingSession(
                supabase,
                connectorId,
            );

            return session;
        } catch (error) {
            const normalizedError =
                error instanceof Error
                    ? error
                    : new Error("No se pudo iniciar la carga");

            setError(normalizedError);

            throw normalizedError;
        } finally {
            setLoading(false);
        }
    };

    return {
        startCharging,
        loading,
        error,
    };
}
