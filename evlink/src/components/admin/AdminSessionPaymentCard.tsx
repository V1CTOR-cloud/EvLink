import {
  CheckCircle,
  CircleX,
  Clock,
  CreditCard,
  RotateCcw,
  type LucideIcon,
} from "lucide-react";

import type { AdminSessionDetail } from "@/services/admin-sessions";

type AdminSessionPaymentCardProps = {
  payment: AdminSessionDetail["payment"];
};

type PaymentStatus = NonNullable<AdminSessionDetail["payment"]>["status"];

const STATUS_LABELS: Record<PaymentStatus, string> = {
  pending: "Pendiente",
  completed: "Completado",
  failed: "Fallido",
  refunded: "Reembolsado",
};

const STATUS_CLASSES: Record<PaymentStatus, string> = {
  pending: "bg-yellow-500/10 text-yellow-600",
  completed: "bg-green-500/10 text-green-600",
  failed: "bg-destructive/10 text-destructive",
  refunded: "bg-muted text-muted-foreground",
};

const STATUS_ICONS: Record<PaymentStatus, LucideIcon> = {
  pending: Clock,
  completed: CheckCircle,
  failed: CircleX,
  refunded: RotateCcw,
};

export function AdminSessionPaymentCard({
  payment,
}: AdminSessionPaymentCardProps) {
  return (
    <section className="rounded-xl border border-border bg-card">
      <div className="border-b border-border px-5 py-4">
        <h2 className="text-sm font-semibold">Pago asociado</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Información del pago en modo lectura
        </p>
      </div>

      {!payment ? (
        <div className="flex items-center gap-3 px-5 py-6">
          <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
            <CreditCard className="size-4 text-muted-foreground" />
          </div>

          <div>
            <p className="text-sm font-medium">Sin pago registrado</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Esta sesión no tiene un pago asociado.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-5 p-5 sm:grid-cols-2 xl:grid-cols-4">
          <div>
            <p className="text-xs text-muted-foreground">Importe</p>
            <p className="mt-1 text-lg font-semibold">
              {payment.amount.toFixed(2)} {payment.currency}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Estado</p>
            <span
              className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_CLASSES[payment.status]}`}
            >
              {(() => {
                const StatusIcon = STATUS_ICONS[payment.status];
                return <StatusIcon aria-hidden="true" className="size-3.5" />;
              })()}
              {STATUS_LABELS[payment.status]}
            </span>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">ID del pago</p>
            <p className="mt-2 break-all font-mono text-xs">{payment.id}</p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Fecha del pago</p>
            <p className="mt-2 text-sm">
              {new Intl.DateTimeFormat("es-ES", {
                dateStyle: "medium",
                timeStyle: "short",
              }).format(new Date(payment.created_at))}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
