"use client";

import { AlertCircle, RefreshCw } from "lucide-react";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center p-6">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 text-center">
        <div className="mx-auto flex size-10 items-center justify-center rounded-lg bg-destructive/10">
          <AlertCircle className="size-5 text-destructive" />
        </div>

        <h1 className="mt-4 text-sm font-semibold">
          No se pudo cargar el dashboard
        </h1>

        <p className="mt-1 text-xs text-muted-foreground">
          Ha ocurrido un error al obtener tus datos. Inténtalo de nuevo.
        </p>

        <button
          type="button"
          onClick={reset}
          className="mt-5 inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <RefreshCw className="size-3.5" />
          Reintentar
        </button>
      </div>
    </main>
  );
}