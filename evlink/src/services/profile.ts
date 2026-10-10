import { createClient } from "@/lib/supabase/client";
import { Profile } from "@/types";

export async function getProfile(userId: string): Promise<Profile> {
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

export async function updateProfile(
  userId: string,
  data: Pick<Profile, "full_name">,
): Promise<Profile> {
  const supabase = createClient();

  const { data: profile, error } = await supabase
    .from("profiles")
    .update({
      full_name: data.full_name,
    })
    .eq("id", userId)
    .select("id, full_name, role")
    .single();

  if (error) {
    throw error;
  }

  return profile;
}