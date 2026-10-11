"use client";

import { useEffect } from "react";
import { TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Error en el área administrativa:", error);
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
          No se pudo cargar la información
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Comprueba tus permisos o inténtalo de nuevo más tarde.
        </p>
        <Button onClick={reset} type="button" variant="outline" className="mt-5">
          Reintentar
        </Button>
      </div>
    </section>
  );
}
