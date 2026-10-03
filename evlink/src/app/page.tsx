"use client";

import { useAuth } from "@/app/hooks/useAuth";

export default function Home() {
  const { user } = useAuth();

  return (
    <main>
      <h1>EvLink</h1>

      <p>Usuario: {user ? user.email : "No autenticado"}</p>
    </main>
  );
}
