import {
  CheckCircle2,
  CreditCard,
  RotateCcw,
  XCircle,
} from "lucide-react";

import type { ChargingSessionDetail } from "@/types";
import { ProcessPaymentButton } from "./ProcessPaymentsButton";

type SessionPaymentCardProps = {
  payment: ChargingSessionDetail["payment"];
};

const paymentStatusLabels: Record<
  NonNullable<ChargingSessionDetail["payment"]>["status"],
  string
> = {
  pending: "Pendiente",
  completed: "Completado",
  failed: "Fallido",
  refunded: "Reembolsado",
};

const paymentStatusClasses: Record<
  NonNullable<ChargingSessionDetail["payment"]>["status"],
  string
> = {
  pending: "bg-yellow-500/10 text-yellow-600",
  completed: "bg-green-500/10 text-green-600",
  failed: "bg-destructive/10 text-destructive",
  refunded: "bg-muted text-muted-foreground",
};

function getStatusIcon(
  status: NonNullable<
    ChargingSessionDetail["payment"]
  >["status"],
) {
  switch (status) {
    case "completed":
      return CheckCircle2;
    case "failed":
      return XCircle;
    case "refunded":
      return RotateCcw;
    case "pending":
      return CreditCard;
  }
}

export function SessionPaymentCard({
  payment,
}: SessionPaymentCardProps) {
  if (!payment) {
    return (
      <section className="rounded-xl border border-border bg-card">
        <div className="border-b border-border px-5 py-4">
          <h2 className="text-sm font-semibold">
            Pago
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Información del pago asociado
          </p>
        </div>

        <div className="flex items-center gap-3 px-5 py-6">
          <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
            <CreditCard className="size-4 text-muted-foreground" />
          </div>

          <div>
            <p className="text-sm font-medium">
              Sin pago registrado
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Esta sesión todavía no tiene un pago asociado.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const StatusIcon = getStatusIcon(payment.status);

  return (
    <section className="rounded-xl border border-border bg-card">
      <div className="border-b border-border px-5 py-4">
        <h2 className="text-sm font-semibold">
          Pago
        </h2>

        <p className="mt-1 text-xs text-muted-foreground">
          Información del pago asociado
        </p>
      </div>

      <div className="grid gap-6 p-5 sm:grid-cols-3">
        <div>
          <p className="text-xs text-muted-foreground">
            Importe
          </p>

          <p className="mt-1 text-lg font-semibold">
            {Number(payment.amount).toFixed(2)}{" "}
            {payment.currency}
          </p>
        </div>

        <div>
          <p className="text-xs text-muted-foreground">
            Estado
          </p>

          <span
            className={[
              "mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
              paymentStatusClasses[payment.status],
            ].join(" ")}
          >
            <StatusIcon className="size-3.5" />
            {paymentStatusLabels[payment.status]}
          </span>
        </div>

        <div>
          <p className="text-xs text-muted-foreground">
            ID del pago
          </p>

          <p className="mt-2 truncate font-mono text-xs">
            {payment.id}
          </p>
        </div>
      </div>

      {payment.status === "pending" && (
        <div className="flex items-center justify-between gap-4 border-t border-border bg-muted/30 px-5 py-4">
          <div>
            <p className="text-sm font-medium">
              Pago pendiente
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Completa el pago para finalizar el proceso de esta sesión.
            </p>
          </div>

          <ProcessPaymentButton
            paymentId={payment.id}
          />
        </div>
      )}
    </section>
  );
}