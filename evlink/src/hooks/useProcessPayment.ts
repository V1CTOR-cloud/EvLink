"use client";

import { useState } from "react";

import { createClient } from "@/lib/supabase/client";
import { processPayment } from "@/services/payments";
import type { Payment } from "@/types";

export function useProcessPayment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const [supabase] = useState(() => createClient());

  const process = async (
    paymentId: string,
  ): Promise<Payment> => {
    try {
      setLoading(true);
      setError(null);

      const payment = await processPayment(
        supabase,
        paymentId,
      );

      return payment;
    } catch (error) {
      const normalizedError =
        error instanceof Error
          ? error
          : new Error(
              "No se pudo procesar el pago",
            );

      setError(normalizedError);
      throw normalizedError;
    } finally {
      setLoading(false);
    }
  };

  return {
    process,
    loading,
    error,
  };
}