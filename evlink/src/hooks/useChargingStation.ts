"use client";

import { useEffect, useState } from "react";

import { createClient } from "@/lib/supabase/client";
import { getChargingStations } from "@/services/charging-stations";
import type { ChargingStation } from "@/types";

export function useChargingStations() {
  const [stations, setStations] = useState<ChargingStation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const [supabase] = useState(() => createClient());

  useEffect(() => {
    const loadStations = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getChargingStations(supabase);

        setStations(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error
            : new Error("No se pudieron obtener las estaciones"),
        );
      } finally {
        setLoading(false);
      }
    };

    loadStations();
  }, [supabase]);

  return {
    stations,
    loading,
    error,
  };
}