import { createClient } from "@/lib/supabase/client";

export async function getProfile(userId: string) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, role")
        .eq("id", userId)
        .single();

    if (error) {
        throw error;
    }

    return data;
}