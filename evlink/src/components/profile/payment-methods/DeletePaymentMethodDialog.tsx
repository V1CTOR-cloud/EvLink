"use client";

import { CreditCard, LoaderCircle, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { PaymentBrand, PaymentMethod } from "@/types";

const brandLabels: Record<PaymentBrand, string> = {
  visa: "VISA",
  mastercard: "Mastercard",
  amex: "American Express",
};

type DeletePaymentMethodDialogProps = {
  method: PaymentMethod | null;
  deleting: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
};

export function DeletePaymentMethodDialog({
  method,
  deleting,
  onOpenChange,
  onConfirm,
}: DeletePaymentMethodDialogProps) {
  return (
    <Dialog
      open={method !== null}
      onOpenChange={(open) => {
        if (!open && !deleting) onOpenChange(false);
      }}
    >
      <DialogContent className="evlink-dialog w-[calc(100%-1.5rem)] rounded-3xl sm:max-w-md">
        <DialogHeader className="space-y-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <Trash2 className="size-5" />
          </div>

          <DialogTitle className="text-xl tracking-tight">
            Eliminar tarjeta
          </DialogTitle>

          <DialogDescription className="leading-relaxed">
            {method?.is_default
              ? "Esta es tu tarjeta predeterminada. No es obligatorio tener una tarjeta predeterminada y puedes elegir otra desde sus opciones."
              : `Se eliminará la tarjeta ${
                  method ? brandLabels[method.brand] : ""
                } terminada en ${method?.last_four ?? ""} de tu cuenta.`}{" "}
            Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-3 rounded-2xl border bg-muted/30 p-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border bg-background">
            <CreditCard className="size-5 text-muted-foreground" />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">
              {method
                ? `${brandLabels[method.brand]} ···· ${method.last_four}`
                : "Tarjeta"}
            </p>

            {method && (
              <p className="mt-1 text-xs text-muted-foreground">
                Caduca el {String(method.expiry_month).padStart(2, "0")}/
                {method.expiry_year}
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="flex-col-reverse gap-2 sm:flex-row sm:gap-2">
          <Button
            type="button"
            variant="outline"
            className="rounded-xl"
            disabled={deleting}
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>

          <Button
            type="button"
            variant="destructive"
            className="rounded-xl"
            disabled={deleting || !method}
            onClick={() => void onConfirm()}
          >
            {deleting && <LoaderCircle className="size-4 animate-spin" />}
            {deleting ? "Eliminando..." : "Eliminar tarjeta"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
