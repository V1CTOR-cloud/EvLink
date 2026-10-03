"use client";

import { useState } from "react";
import type { User } from "@supabase/supabase-js";

import { AuthContext } from "@/app/contexts/AuthContext";

type AuthProviderProps = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
}
