"use client";

import { useEffect, useState } from "react";

import { getProfile, updateProfile } from "@/services/profile";

import type { Profile } from "@/types";

export function useProfile(userId?: string) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(Boolean(userId));
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      return;
    }

    let cancelled = false;

    const loadProfile = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getProfile(userId);

        if (!cancelled) {
          setProfile(data);
        }
      } catch (error) {
        if (!cancelled) {
          setError(
            error instanceof Error
              ? error
              : new Error("No se pudo cargar el perfil"),
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadProfile();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const update = async (fullName: string) => {
    if (!userId) {
      throw new Error("No hay un usuario autenticado");
    }

    const updatedProfile = await updateProfile(userId, {
      full_name: fullName,
    });

    setProfile(updatedProfile);

    return updatedProfile;
  };

  return {
    profile,
    loading,
    error,
    update,
  };
}