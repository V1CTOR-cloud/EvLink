"use client";

import { useEffect, useRef, useState } from "react";

import { createClient } from "@/lib/supabase/client";
import { getChargingSessions } from "@/services/charging-sessions";
import { getChargingStations } from "@/services/charging-stations";
import type {
  ChargingSession,
  ChargingStationWithConnectors,
} from "@/types";

type GlobalSearchData = {
  userId: string;
  retryCount: number;
  stations: ChargingStationWithConnectors[];
  sessions: ChargingSession[];
  error: Error | null;
};

export function useGlobalSearch(open: boolean, userId?: string) {
  const [data, setData] = useState<GlobalSearchData | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [supabase] = useState(() => createClient());
  const activeRequestKey = useRef<string | null>(null);
  const inFlightKey = useRef<string | null>(null);
  const requestId = useRef(0);

  useEffect(() => {
    if (!userId) {
      activeRequestKey.current = null;
      inFlightKey.current = null;
      requestId.current += 1;
      return;
    }

    if (!open) {
      return;
    }

    const key = `${userId}:${retryCount}`;
    if (activeRequestKey.current !== key) {
      activeRequestKey.current = key;

      if (inFlightKey.current !== key) {
        inFlightKey.current = null;
        requestId.current += 1;
      }
    }

    if (
      data?.userId === userId &&
      data.retryCount === retryCount
    ) {
      return;
    }

    if (inFlightKey.current === key) {
      return;
    }

    const currentRequestId = ++requestId.current;
    inFlightKey.current = key;

    Promise.all([
      getChargingStations(supabase),
      getChargingSessions(supabase, userId),
    ])
      .then(([stations, sessions]) => {
        if (
          requestId.current !== currentRequestId ||
          activeRequestKey.current !== key
        ) {
          return;
        }

        inFlightKey.current = null;
        setData({
          userId,
          retryCount,
          stations,
          sessions,
          error: null,
        });
      })
      .catch((cause: unknown) => {
        if (
          requestId.current !== currentRequestId ||
          activeRequestKey.current !== key
        ) {
          return;
        }

        inFlightKey.current = null;
        setData({
          userId,
          retryCount,
          stations: [],
          sessions: [],
          error:
            cause instanceof Error
              ? cause
              : new Error("No se pudieron cargar los datos de búsqueda."),
        });
      });
  }, [data, open, retryCount, supabase, userId]);

  const userData = data?.userId === userId ? data : null;
  const loading =
    open &&
    (!userId ||
      !userData ||
      (userData.error !== null && retryCount > userData.retryCount));

  return {
    stations: userData?.stations ?? [],
    sessions: userData?.sessions ?? [],
    loading,
    error:
      userData?.retryCount === retryCount ? userData.error : null,
    retry: () => setRetryCount((count) => count + 1),
  };
}
