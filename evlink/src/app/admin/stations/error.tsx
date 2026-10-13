"use client";

import { useEffect } from "react";
import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

type AdminStationsErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AdminStationsError({
  error,
  reset,
}: AdminStationsErrorProps) {
  useEffect(() => {
    console.error("Error loading admin charging stations:", error);
  }, [error]);

  return (
    <section className="flex min-h-80 items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-5 text-center">
        <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-destructive/10">
          <TriangleAlert
            aria-hidden="true"
            className="size-5 text-destructive"
          />
        </div>
        <h1 className="mt-4 text-sm font-semibold">
          No se pudieron cargar las estaciones
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Comprueba tu conexión e inténtalo de nuevo. Si el problema continúa,
          revisa los permisos de acceso en Supabase.
        </p>
        <Button type="button" variant="outline" onClick={reset} className="mt-5">
          Reintentar
        </Button>
      </div>
    </section>
  );
}
