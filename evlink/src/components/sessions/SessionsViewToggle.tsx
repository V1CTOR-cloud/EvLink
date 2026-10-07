"use client";

import { Grid2X2, List } from "lucide-react";

type SessionsView = "cards" | "table";

type SessionsViewToggleProps = {
  value: SessionsView;
  onChange: (value: SessionsView) => void;
};

export function SessionsViewToggle({
  value,
  onChange,
}: SessionsViewToggleProps) {
  return (
    <nav
      aria-label="Vista de sesiones"
      className="inline-flex items-center rounded-lg border border-border bg-muted/40 p-1"
    >
      <button
        type="button"
        onClick={() => onChange("cards")}
        aria-current={value === "cards" ? "page" : undefined}
        className={[
          "inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
          value === "cards"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground",
        ].join(" ")}
      >
        <Grid2X2 className="size-3.5" />
        Tarjetas
      </button>

      <button
        type="button"
        onClick={() => onChange("table")}
        aria-current={value === "table" ? "page" : undefined}
        className={[
          "inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
          value === "table"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground",
        ].join(" ")}
      >
        <List className="size-3.5" />
        Tabla
      </button>
    </nav>
  );
}
