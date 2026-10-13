import { CircleCheck, TriangleAlert } from "lucide-react";

type IncidentStateProps = {
  type: "empty" | "error";
};

export function IncidentState({ type }: IncidentStateProps) {
  const isError = type === "error";

  return (
    <div
      role={isError ? "alert" : "status"}
      className="flex items-start gap-3 rounded-xl border border-border bg-card p-5"
    >
      <span
        className={
          isError
            ? "flex size-9 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive"
            : "flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"
        }
      >
        {isError ? (
          <TriangleAlert aria-hidden="true" className="size-4" />
        ) : (
          <CircleCheck aria-hidden="true" className="size-4" />
        )}
      </span>

      <div>
        <p className="text-sm font-medium">
          {isError
            ? "No se pudieron cargar las incidencias"
            : "La red está en servicio"}
        </p>

        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          {isError
            ? "Comprueba los permisos o inténtalo de nuevo más tarde."
            : "No hay estaciones ni conectores sin conexión o en mantenimiento."}
        </p>
      </div>
    </div>
  );
}
