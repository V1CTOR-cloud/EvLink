"use client";

import { Button } from "@/components/ui/button";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ reset }: ErrorProps) {
  return (
    <section className="space-y-4 p-6">
      <h1 className="text-2xl font-semibold">
        No se pudieron cargar las estaciones
      </h1>

      <p className="text-muted-foreground">
        Ha ocurrido un error al obtener las estaciones.
      </p>

      <Button onClick={reset}>Reintentar</Button>
    </section>
  );
}
