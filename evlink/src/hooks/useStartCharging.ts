
"use client";

import { useState } from "react";

import { startChargingAction } from "@/services/actions/charging-session";

export function useStartCharging() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const startCharging = async (connectorId: string) => {
    try {
      setLoading(true);
      setError(null);

      const result = await startChargingAction(connectorId);

      if (!result.success) {
        throw new Error(result.error);
      }

      return result.session;
    } catch (cause) {
      const normalizedError =
        cause instanceof Error
          ? cause
          : new Error("No se pudo iniciar la carga.");

      setError(normalizedError);
      throw normalizedError;
    } finally {
      setLoading(false);
    }
  };

  return { startCharging, loading, error };
}
