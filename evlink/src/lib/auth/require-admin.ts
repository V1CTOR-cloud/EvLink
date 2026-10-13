
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export async function requireAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, status")
    .eq("id", user.id)
    .maybeSingle();

  if (
    profileError ||
    profile?.role !== "admin" ||
    profile?.status !== "active"
  ) {
    redirect("/");
  }

  return { supabase, user, profile };
}
