"use client";

import { useEffect } from "react";
import { CreditCard, LoaderCircle, ShieldCheck, Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  paymentBrands,
  paymentMethodSchema,
  type PaymentMethodFormData,
} from "@/schemas/payment-method";
import type { PaymentBrand, PaymentMethod } from "@/types";

import { PaymentCardVisual } from "./PaymentMethodCardVisual";

const brandLabels: Record<PaymentBrand, string> = {
  visa: "Visa",
  mastercard: "Mastercard",
  amex: "American Express",
};

type PaymentMethodFormDialogProps = {
  open: boolean;
  method: PaymentMethod | null;
  saving: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: PaymentMethodFormData) => Promise<void>;
};

export function PaymentMethodFormDialog({
  open,
  method,
  saving,
  onOpenChange,
  onSave,
}: PaymentMethodFormDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<PaymentMethodFormData>({
    resolver: zodResolver(paymentMethodSchema),
    mode: "onBlur",
    defaultValues: {
      brand: "visa",
      last_four: "",
      expiry_month: new Date().getMonth() + 1,
      expiry_year: new Date().getFullYear() + 1,
    },
  });

  const previewBrand = watch("brand") ?? "visa";
  const previewLastFour = watch("last_four") ?? "";
  const previewMonth = watch("expiry_month") ?? new Date().getMonth() + 1;
  const previewYear = watch("expiry_year") ?? new Date().getFullYear() + 1;

  useEffect(() => {
    reset(
      method
        ? {
            brand: method.brand,
            last_four: method.last_four,
            expiry_month: method.expiry_month,
            expiry_year: method.expiry_year,
          }
        : {
            brand: "visa",
            last_four: "",
            expiry_month: new Date().getMonth() + 1,
            expiry_year: new Date().getFullYear() + 1,
          },
    );
  }, [method, open, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[94dvh] w-[calc(100%-1rem)] gap-0 overflow-y-auto rounded-2xl border-border p-0 sm:w-[calc(100%-3rem)] sm:max-w-6xl">
        <div className="grid min-w-0 md:grid-cols-[1fr_1fr] lg:grid-cols-[1.05fr_0.95fr]">
          {/* Panel visual */}
          <div className="relative flex min-w-0 flex-col justify-between gap-8 overflow-hidden border-b bg-muted/30 p-5 sm:p-8 lg:p-10 md:border-b-0 md:border-r">
            <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-primary/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-20 size-64 rounded-full bg-primary/5 blur-3xl" />

            <div className="relative space-y-4">
              <div className="flex size-12 items-center justify-center rounded-xl border border-primary/15 bg-primary/10 text-primary">
                <CreditCard className="size-5" />
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  EvLink Wallet
                </p>

                <h2 className="max-w-md text-2xl font-semibold tracking-tight sm:text-3xl">
                  Tu energía.
                  <br />
                  Tus métodos de pago.
                </h2>

                <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
                  Gestiona los datos ficticios de tus tarjetas. No se utilizan
                  en los pagos simulados de las sesiones de recarga.
                </p>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-lg space-y-5">
              <PaymentCardVisual
                brand={previewBrand}
                last_four={previewLastFour}
                expiry_month={previewMonth}
                expiry_year={previewYear}
                is_default={method?.is_default ?? false}
                preview
              />

              <div className="flex items-start gap-3 rounded-xl border border-border/80 bg-card/80 p-4 backdrop-blur-sm">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <ShieldCheck className="size-4" />
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium">Datos de prueba</p>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Este formulario no procesa pagos reales. No introduzcas
                    números completos de tarjeta ni el CVV.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative hidden items-center gap-2 text-xs text-muted-foreground lg:flex">
              <span className="size-2 rounded-full bg-primary" />
              Diseñado para tu experiencia de recarga EvLink
            </div>
          </div>

          {/* Panel formulario */}
          <div className="min-w-0 p-5 sm:p-8 lg:p-10">
            <DialogHeader className="space-y-3 text-left">
              <div className="flex items-center gap-2 text-sm font-medium text-primary">
                <Sparkles className="size-4" />
                {method ? "Actualizar método" : "Nuevo método"}
              </div>

              <DialogTitle className="text-2xl font-semibold tracking-tight sm:text-3xl">
                {method ? "Editar tarjeta" : "Añadir tarjeta"}
              </DialogTitle>

              <DialogDescription className="max-w-md leading-relaxed">
                Personaliza los datos ficticios y comprueba el resultado en la
                vista previa.
              </DialogDescription>
            </DialogHeader>

            <form
              onSubmit={handleSubmit(onSave)}
              className="mt-8 space-y-6"
              autoComplete="off"
            >
              <div className="space-y-2">
                <Label htmlFor="payment-brand">Marca de tarjeta</Label>

                <select
                  id="payment-brand"
                  {...register("brand")}
                  className="flex h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20"
                >
                  {paymentBrands.map((brand) => (
                    <option key={brand} value={brand}>
                      {brandLabels[brand]}
                    </option>
                  ))}
                </select>

                {errors.brand && (
                  <p className="text-xs text-destructive">
                    {errors.brand.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment-last-four">
                  Últimos cuatro dígitos
                </Label>

                <Input
                  id="payment-last-four"
                  inputMode="numeric"
                  maxLength={4}
                  placeholder="1234"
                  className="h-11 rounded-xl font-mono tracking-wider"
                  {...register("last_four")}
                />

                {errors.last_four && (
                  <p className="text-xs text-destructive">
                    {errors.last_four.message}
                  </p>
                )}

                <p className="text-xs leading-relaxed text-muted-foreground">
                  Utiliza únicamente cuatro dígitos ficticios.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="min-w-0 space-y-2">
                  <Label htmlFor="payment-expiry-month">Mes</Label>

                  <select
                    id="payment-expiry-month"
                    {...register("expiry_month", {
                      valueAsNumber: true,
                    })}
                    className="flex h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20"
                  >
                    {Array.from({ length: 12 }, (_, index) => index + 1).map(
                      (month) => (
                        <option key={month} value={month}>
                          {String(month).padStart(2, "0")}
                        </option>
                      ),
                    )}
                  </select>

                  {errors.expiry_month && (
                    <p className="text-xs text-destructive">
                      {errors.expiry_month.message}
                    </p>
                  )}
                </div>

                <div className="min-w-0 space-y-2">
                  <Label htmlFor="payment-expiry-year">Año</Label>

                  <Input
                    id="payment-expiry-year"
                    type="number"
                    inputMode="numeric"
                    min={new Date().getFullYear()}
                    max={9999}
                    className="h-11 rounded-xl"
                    {...register("expiry_year", {
                      valueAsNumber: true,
                    })}
                  />

                  {errors.expiry_year && (
                    <p className="text-xs text-destructive">
                      {errors.expiry_year.message}
                    </p>
                  )}
                </div>
              </div>

              <DialogFooter className="flex-col-reverse gap-2 border-t border-border pt-5 sm:flex-row sm:gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 rounded-xl sm:min-w-28"
                  onClick={() => onOpenChange(false)}
                  disabled={saving}
                >
                  Cancelar
                </Button>

                <Button
                  type="submit"
                  className="h-11 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 sm:flex-1"
                  disabled={saving}
                >
                  {saving ? (
                    <LoaderCircle className="size-4 animate-spin" />
                  ) : (
                    <CreditCard className="size-4" />
                  )}

                  {saving
                    ? "Guardando..."
                    : method
                      ? "Guardar cambios"
                      : "Añadir tarjeta"}
                </Button>
              </DialogFooter>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
