"use client";

import { useEffect } from "react";

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
    <section className="space-y-3 p-4 sm:p-6">
      <h1 className="text-lg font-semibold">No se pudo cargar la información</h1>
      <p className="text-sm text-muted-foreground">
        Comprueba tus permisos o inténtalo de nuevo más tarde.
      </p>
      <Button onClick={reset} type="button" variant="outline">
        Reintentar
      </Button>
    </section>
  );
}
