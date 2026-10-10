"use client";

import { useState } from "react";

import { createClient } from "@/lib/supabase/client";
import { createPayment } from "@/services/payments";
import type { Payment } from "@/types";

export function useCreatePayment() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [supabase] = useState(() => createClient());

    const create = async (
        sessionId: string,
    ): Promise<Payment> => {
        try {
            setLoading(true);
            setError(null);

            const payment = await createPayment(
                supabase,
                sessionId,
            );

            return payment;
        } catch (error) {
            const normalizedError =
                error instanceof Error
                    ? error
                    : new Error("No se pudo crear el pago");

            setError(normalizedError);

            throw normalizedError;
        } finally {
            setLoading(false);
        }
    };

    return {
        create,
        loading,
        error,
    };
}