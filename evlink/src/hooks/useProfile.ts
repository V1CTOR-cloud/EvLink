import { useEffect, useState } from "react";

import { getProfile } from "@/services/profile";

type Profile = {
    id: string;
    full_name: string;
    role: "driver" | "admin";
};

export function useProfile(userId?: string) {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!userId) {
            setProfile(null);
            return;
        }

        const loadProfile = async () => {
            try {
                setLoading(true);
                setError(null);

                const data = await getProfile(userId);

                setProfile(data);
            } catch (error) {
                setError(
                    error instanceof Error
                        ? error
                        : new Error("No se pudo obtener el perfil"),
                );
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, [userId]);

    return {
        profile,
        loading,
        error,
    };
}