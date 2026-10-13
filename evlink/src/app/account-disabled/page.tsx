"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";

export default function AccountDisabledPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [supabase] = useState(() => createClient());

  const handleLogout = async () => {
    setLoading(true);

    const { error } = await supabase.auth.signOut();

    if (error) {
      toast.error("No se ha podido cerrar la sesión.");
      setLoading(false);
      return;
    }

    router.replace("/login");
    router.refresh();
  };

  return (
    <main className="flex min-h-svh items-center justify-center p-6">
      <section className="w-full max-w-md space-y-6 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-destructive/10">
          <ShieldAlert className="size-7 text-destructive" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Acceso no disponible</h1>

          <p className="text-muted-foreground">
            Tu cuenta no tiene acceso a EvLink en este momento. Si crees que se
            trata de un error, contacta con el administrador de la plataforma.
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
        >
          <LogOut className="size-4" />
          {loading ? "Cerrando sesión..." : "Cerrar sesión"}
        </button>
      </section>
    </main>
  );
}
