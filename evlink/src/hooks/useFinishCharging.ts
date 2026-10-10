"use client";

import { useState } from "react";

import { createClient } from "@/lib/supabase/client";
import { finishCharging } from "@/services/charging-sessions";

export function useFinishCharging() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const [supabase] = useState(() => createClient());

  const finish = async (sessionId: string) => {
    try {
      setLoading(true);
      setError(null);

      const result = await finishCharging(
        supabase,
        sessionId,
      );

      return result;
    } catch (error) {
      const normalizedError =
        error instanceof Error
          ? error
          : new Error(
              "No se pudo finalizar la sesión",
            );

      setError(normalizedError);

      throw normalizedError;
    } finally {
      setLoading(false);
    }
  };

  return {
    finish,
    loading,
    error,
  };
}