"use client";

import { useState } from "react";
import { AlertTriangle, Pencil, Plug, Plus, Trash2, Zap } from "lucide-react";

import type { Connector } from "@/types";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  connectorStatusLabels,
  connectorTypeLabels,
} from "@/schemas/connector";
import { useDeleteConnector } from "@/hooks/useDeleteConnector";

import { ConnectorForm } from "./ConnectorForm";

type ConnectorManagementProps = {
  stationId: string;
  connectors: Connector[];
};

const statusStyles: Record<Connector["status"], string> = {
  available: "bg-green-500/10 text-green-600",
  occupied: "bg-yellow-500/10 text-yellow-600",
  offline: "bg-muted text-muted-foreground",
  maintenance: "bg-orange-500/10 text-orange-600",
};

export function ConnectorManagement({
  stationId,
  connectors,
}: ConnectorManagementProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingConnector, setEditingConnector] =
    useState<Connector | null>(null);
  const [deletingConnector, setDeletingConnector] =
    useState<Connector | null>(null);

  const { remove, pending } = useDeleteConnector();

  function openCreateDialog() {
    setEditingConnector(null);
    setDialogOpen(true);
  }

  function openEditDialog(connector: Connector) {
    setEditingConnector(connector);
    setDialogOpen(true);
  }

  function closeDialog() {
    setDialogOpen(false);
    setEditingConnector(null);
  }

  function confirmDelete() {
    if (!deletingConnector || pending) return;

    remove(deletingConnector.id);
    setDeletingConnector(null);
  }

  return (
    <section className="min-w-0 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Plug className="size-4 text-muted-foreground" />
            <h2 className="text-base font-semibold tracking-tight">
              Conectores
            </h2>
            <span className="text-xs tabular-nums text-muted-foreground">
              ({connectors.length})
            </span>
          </div>

          <p className="mt-1 text-xs text-muted-foreground">
            Configuración y estado operativo.
          </p>
        </div>

        <Button size="sm" onClick={openCreateDialog} className="shrink-0">
          <Plus className="size-3.5" />
          Añadir
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg border">
        {connectors.length === 0 ? (
          <div className="flex flex-col items-center px-4 py-9 text-center">
            <div className="flex size-9 items-center justify-center rounded-md bg-muted">
              <Plug className="size-4 text-muted-foreground" />
            </div>

            <p className="mt-3 text-sm font-medium">Sin conectores</p>
            <p className="mt-1 max-w-xs text-xs text-muted-foreground">
              Añade un conector para configurar sus características.
            </p>

            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={openCreateDialog}
            >
              <Plus className="size-3.5" />
              Añadir conector
            </Button>
          </div>
        ) : (
          <ul aria-label="Lista de conectores" className="divide-y">
            {connectors.map((connector) => (
              <li
                key={connector.id}
                className="flex min-w-0 items-center gap-1 pr-2 sm:pr-3"
              >
                <button
                  type="button"
                  onClick={() => openEditDialog(connector)}
                  aria-label={`Editar ${connectorTypeLabels[connector.connector_type]}`}
                  className="group/connector flex min-w-0 flex-1 cursor-pointer items-center gap-3 px-3 py-3 text-left transition-colors hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring sm:px-4"
                >
                  <div
                    className={cn(
                      "flex size-9 shrink-0 items-center justify-center rounded-md bg-muted",
                      connector.status !== "available" &&
                        "text-muted-foreground/70",
                    )}
                  >
                    <Zap className="size-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="text-sm font-medium">
                        {connectorTypeLabels[connector.connector_type]}
                      </span>

                      <span
                        className={cn(
                          "inline-flex max-w-full items-center rounded-full px-2 py-0.5 text-[11px] font-medium",
                          statusStyles[connector.status],
                        )}
                      >
                        {connectorStatusLabels[connector.status]}
                      </span>
                    </div>

                    <p className="mt-1 text-xs tabular-nums text-muted-foreground">
                      {Number(connector.power_kw).toLocaleString("es-ES", {
                        maximumFractionDigits: 1,
                      })}{" "}
                      kW
                      <span className="mx-1.5">·</span>
                      {Number(connector.price_per_kwh).toLocaleString("es-ES", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 3,
                      })}{" "}
                      €/kWh
                    </p>
                  </div>

                  <span className="flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors group-hover/connector:bg-primary/10 group-hover/connector:text-primary">
                    <Pencil className="size-4" />
                  </span>
                </button>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-9 shrink-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  aria-label={`Eliminar ${connectorTypeLabels[connector.connector_type]}`}
                  title="Eliminar conector"
                  disabled={pending}
                  onClick={() => setDeletingConnector(connector)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingConnector(null);
        }}
      >
        <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingConnector ? "Editar conector" : "Nuevo conector"}
            </DialogTitle>

            <DialogDescription>
              {editingConnector
                ? "Modifica la configuración del punto de recarga."
                : "Configura un nuevo punto de recarga para esta estación."}
            </DialogDescription>
          </DialogHeader>

          <ConnectorForm
            key={editingConnector?.id ?? "new"}
            stationId={stationId}
            connectorId={editingConnector?.id}
            initialValues={
              editingConnector
                ? {
                    connector_type: editingConnector.connector_type,
                    power_kw: editingConnector.power_kw,
                    price_per_kwh: editingConnector.price_per_kwh,
                    status: editingConnector.status,
                  }
                : undefined
            }
            onSuccess={closeDialog}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={deletingConnector !== null}
        onOpenChange={(open) => {
          if (!open && !pending) setDeletingConnector(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mb-1 flex size-10 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="size-5 text-destructive" />
            </div>

            <DialogTitle>Eliminar conector</DialogTitle>

            <DialogDescription>
              ¿Seguro que quieres eliminar{" "}
              <span className="font-medium text-foreground">
                {deletingConnector
                  ? connectorTypeLabels[deletingConnector.connector_type]
                  : "este conector"}
              </span>
              ? Esta acción no se puede deshacer. Si tiene sesiones asociadas,
              la base de datos impedirá eliminarlo para conservar el historial.
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={pending}
              onClick={() => setDeletingConnector(null)}
            >
              Cancelar
            </Button>

            <Button
              type="button"
              variant="destructive"
              disabled={pending || !deletingConnector}
              onClick={confirmDelete}
            >
              <Trash2 className="size-4" />
              {pending ? "Eliminando..." : "Eliminar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
