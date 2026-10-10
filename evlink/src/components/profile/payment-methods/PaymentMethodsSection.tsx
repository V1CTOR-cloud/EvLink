"use client";

import { useState } from "react";
import { CreditCard, LoaderCircle, Plus, ShieldCheck, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { usePaymentMethods } from "@/hooks/usePaymentMethods";
import type { PaymentMethod } from "@/types";
import type { PaymentMethodFormData } from "@/schemas/payment-method";

import { DeletePaymentMethodDialog } from "./DeletePaymentMethodDialog";
import { PaymentMethodCard } from "./PaymentMethodCard";
import { PaymentMethodFormDialog } from "./PaymentMethodFormDialog";

export function PaymentMethodsSection({ userId }: { userId: string }) {
  const {
    paymentMethods,
    loading,
    error,
    mutating,
    retry,
    create,
    update,
    remove,
    setDefault,
  } = usePaymentMethods(userId);

  const [formOpen, setFormOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(
    null,
  );
  const [deletingMethod, setDeletingMethod] = useState<PaymentMethod | null>(
    null,
  );

  async function handleSave(data: PaymentMethodFormData) {
    try {
      if (editingMethod) {
        await update(editingMethod.id, data);
        toast.success("Tarjeta actualizada");
      } else {
        await create(data);
        toast.success("Tarjeta añadida");
      }

      setFormOpen(false);
      setEditingMethod(null);
    } catch (cause) {
      toast.error(
        cause instanceof Error
          ? cause.message
          : "No se pudo guardar la tarjeta",
      );
    }
  }

  async function handleDelete() {
    if (!deletingMethod) return;

    try {
      await remove(deletingMethod.id);

      toast.success(
        "Tarjeta eliminada correctamente.",
      );

      setDeletingMethod(null);
    } catch (cause) {
      toast.error(
        cause instanceof Error
          ? cause.message
          : "No se pudo eliminar la tarjeta",
      );
    }
  }

  async function handleSetDefault(method: PaymentMethod) {
    try {
      await setDefault(method.id);
      toast.success("Tarjeta predeterminada actualizada");
    } catch (cause) {
      toast.error(
        cause instanceof Error
          ? cause.message
          : "No se pudo actualizar la tarjeta predeterminada",
      );
    }
  }

  function openCreateDialog() {
    setEditingMethod(null);
    setFormOpen(true);
  }

  function openEditDialog(method: PaymentMethod) {
    setEditingMethod(method);
    setFormOpen(true);
  }

  function handleRequestDelete(method: PaymentMethod) {
    setDeletingMethod(method);
  }

  return (
    <section className="grid grid-cols-1 gap-10 border-t border-border pt-8 lg:grid-cols-3">
      <div className="space-y-2">
        <h2 className="font-semibold tracking-tight">Métodos de pago</h2>

        <p className="text-sm leading-5 text-muted-foreground">
          Gestiona datos ficticios de tarjetas asociados a tu cuenta. Los pagos
          simulados de las sesiones no utilizan estos métodos guardados.
        </p>

        {!loading && !error && paymentMethods.length > 0 && (
          <div className="flex items-center gap-2 pt-2 text-xs text-muted-foreground">
            <ShieldCheck className="size-3.5 text-primary" />
            <span>
              {paymentMethods.length === 1
                ? "1 método de pago guardado"
                : `${paymentMethods.length} métodos de pago guardados`}
            </span>
          </div>
        )}
      </div>

      <div className="min-w-0 space-y-6 lg:col-span-2">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold">Tus tarjetas</h3>
            <p className="text-sm text-muted-foreground">
              Gestiona tus tarjetas guardadas.
            </p>
          </div>

          <Button
            type="button"
            onClick={openCreateDialog}
            disabled={loading || Boolean(error) || mutating}
            className="w-full sm:w-auto"
          >
            <Plus className="size-4" />
            Añadir tarjeta
          </Button>
        </div>

        {loading ? (
          <div className="flex min-h-48 flex-col items-center justify-center gap-3 border-y border-border">
            <LoaderCircle className="size-5 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              Cargando tus tarjetas...
            </p>
          </div>
        ) : error ? (
          <div className="space-y-4 border-y border-border py-6">
            <div className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-destructive/10">
                <X className="size-4 text-destructive" />
              </div>

              <div className="min-w-0 space-y-1">
                <p className="text-sm font-medium">
                  No se pudieron cargar las tarjetas
                </p>
                <p className="wrap-break-word text-sm text-muted-foreground">
                  {error.message}
                </p>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={retry}
              disabled={loading}
            >
              Reintentar
            </Button>
          </div>
        ) : paymentMethods.length === 0 ? (
          <div className="flex min-h-56 flex-col items-center justify-center border-y border-dashed border-border px-6 py-8 text-center">
            <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10">
              <CreditCard className="size-5 text-primary" />
            </div>

            <h3 className="mt-4 text-sm font-semibold">
              Aún no tienes tarjetas
            </h3>

            <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Añade una tarjeta ficticia para organizar tus métodos de pago.
            </p>

            <Button
              type="button"
              className="mt-4"
              onClick={openCreateDialog}
              disabled={mutating}
            >
              <Plus className="size-4" />
              Añadir primera tarjeta
            </Button>
          </div>
        ) : (
          <ul className="flex flex-col gap-8 items-center">
            {paymentMethods.map((method) => (
              <PaymentMethodCard
                key={method.id}
                method={method}
                mutating={mutating}
                onEdit={openEditDialog}
                onSetDefault={handleSetDefault}
                onDelete={handleRequestDelete}
              />
            ))}
          </ul>
        )}

        {!loading && !error && paymentMethods.length > 0 && (
          <div className="flex items-start gap-2.5 border-t border-border pt-4">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <p className="text-xs leading-relaxed text-muted-foreground">
              EvLink utiliza datos ficticios en esta sección. No guardes números
              completos de tarjeta ni códigos de seguridad.
            </p>
          </div>
        )}
      </div>

      <PaymentMethodFormDialog
        open={formOpen}
        method={editingMethod}
        saving={mutating}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditingMethod(null);
        }}
        onSave={handleSave}
      />

      <DeletePaymentMethodDialog
        method={deletingMethod}
        deleting={mutating}
        onOpenChange={(open) => {
          if (!open) setDeletingMethod(null);
        }}
        onConfirm={handleDelete}
      />
    </section>
  );
}
