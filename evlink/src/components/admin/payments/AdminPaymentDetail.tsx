import {
  ArrowLeft,
  CalendarClock,
  CreditCard,
  MapPin,
  ReceiptText,
  UserRound,
  Zap,
} from "lucide-react";
import Link from "next/link";

import { formatDate } from "@/lib/format-date";
import type {
  AdminPayment,
  AdminPaymentStatus,
} from "@/services/admin-payments";

type AdminPaymentDetailProps = {
  payment: AdminPayment;
};

const paymentStatusLabels: Record<AdminPaymentStatus, string> = {
  pending: "Pendiente",
  completed: "Completado",
  failed: "Fallido",
  refunded: "Reembolsado",
};

const paymentStatusClasses: Record<AdminPaymentStatus, string> = {
  pending: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
  completed: "bg-green-500/10 text-green-700 dark:text-green-400",
  failed: "bg-destructive/10 text-destructive",
  refunded: "bg-muted text-muted-foreground",
};

function formatCurrency(amount: number, currency = "EUR") {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency,
  }).format(amount);
}

function formatDateTime(value: string | null | undefined) {
  if (!value) return "Sin fecha";
  return formatDate(value) ?? "Sin fecha";
}

function DetailField({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`min-w-0 border-border px-5 py-4 ${className ?? ""}`}>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-2 break-words text-sm">{children}</dd>
    </div>
  );
}

export function AdminPaymentDetail({ payment }: AdminPaymentDetailProps) {
  const statusLabel = paymentStatusLabels[payment.status];
  const statusClass = paymentStatusClasses[payment.status];

  return (
    <section className="p-4 sm:p-6">
      <div className="mx-auto max-w-5xl space-y-10">
        <div className="space-y-5">
          <Link
            href="/admin/payments"
            className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
            Pagos
          </Link>

          <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted">
                <CreditCard className="size-5 text-muted-foreground" />
              </div>

              <div className="min-w-0">
                <h1 className="text-2xl font-semibold tracking-tight">
                  Detalle del pago
                </h1>

                <p className="mt-1 break-all font-mono text-xs text-muted-foreground">
                  {payment.id}
                </p>

                <p className="mt-3 text-xl font-semibold tracking-tight">
                  {formatCurrency(payment.amount, payment.currency)}
                </p>
              </div>
            </div>

            <span
              className={`inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs font-medium ${statusClass}`}
            >
              {statusLabel}
            </span>
          </header>
        </div>

        <section className="grid gap-6 lg:grid-cols-3 lg:gap-10">
          <div>
            <h2 className="text-sm font-semibold">Información del pago</h2>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Estado, importe y fechas del registro del pago.
            </p>
          </div>

          <div className="overflow-hidden rounded-xl border border-border bg-card lg:col-span-2">
            <dl className="grid gap-0 sm:grid-cols-2">
              <DetailField label="Estado" className="border-b sm:border-r">
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusClass}`}
                >
                  {statusLabel}
                </span>
              </DetailField>

              <DetailField label="Importe" className="border-b">
                <span className="font-semibold">
                  {formatCurrency(payment.amount, payment.currency)}
                </span>
              </DetailField>

              <DetailField
                label="Fecha de creación"
                className="border-b sm:border-r"
              >
                <span className="flex items-start gap-2">
                  <CalendarClock
                    aria-hidden="true"
                    className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                  />
                  {formatDateTime(payment.created_at)}
                </span>
              </DetailField>

              <DetailField label="Última actualización" className="border-b">
                {formatDateTime(payment.updated_at)}
              </DetailField>

              <DetailField label="Moneda" className="sm:border-r">
                {payment.currency}
              </DetailField>

              <DetailField label="ID del pago">
                <span className="font-mono text-xs">{payment.id}</span>
              </DetailField>
            </dl>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3 lg:gap-10">
          <div>
            <h2 className="text-sm font-semibold">Usuario</h2>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Perfil asociado al pago.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 lg:col-span-2">
            <div className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted">
                <UserRound className="size-4 text-muted-foreground" />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-medium">
                  {payment.user.full_name || "Sin nombre"}
                </p>

                <p className="mt-1 break-all font-mono text-xs text-muted-foreground">
                  {payment.user.id}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3 lg:gap-10">
          <div>
            <h2 className="text-sm font-semibold">Estación</h2>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Ubicación de la sesión a la que corresponde el pago.
            </p>
          </div>

          <div className="overflow-hidden rounded-xl border border-border bg-card lg:col-span-2">
            <dl className="grid gap-0 sm:grid-cols-2">
              <DetailField label="Estación" className="border-b sm:border-r">
                <span className="flex items-start gap-2 font-medium">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  {payment.session.station.name}
                </span>
              </DetailField>

              <DetailField label="Ciudad" className="border-b">
                {payment.session.station.city || "Sin ciudad"}
              </DetailField>

              <DetailField
                label="Fecha de la sesión"
                className="border-b sm:border-r"
              >
                {formatDateTime(payment.session.created_at)}
              </DetailField>

              <DetailField label="Estado de la sesión" className="border-b">
                {payment.session.status}
              </DetailField>

              <DetailField label="ID de la sesión" className="sm:col-span-2">
                <span className="font-mono text-xs">{payment.session.id}</span>
              </DetailField>
            </dl>

            <div className="border-t border-border p-4">
              <Link
                href={`/admin/sessions/${payment.session.id}`}
                className="inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-muted-foreground"
              >
                <Zap className="size-4" />
                Ver sesión asociada
                <ReceiptText className="size-4" />
              </Link>
            </div>
          </div>
        </section>

        <section className="grid gap-6 border-t border-border pt-10 lg:grid-cols-3 lg:gap-10">
          <div>
            <h2 className="text-sm font-semibold">Referencias</h2>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Identificadores utilizados para relacionar los registros.
            </p>
          </div>

          <div className="overflow-hidden rounded-xl border border-border bg-card lg:col-span-2">
            <dl>
              <DetailField label="ID del usuario" className="border-b">
                <span className="font-mono text-xs">{payment.user_id}</span>
              </DetailField>

              <DetailField label="ID de la sesión">
                <span className="font-mono text-xs">{payment.session_id}</span>
              </DetailField>
            </dl>
          </div>
        </section>
      </div>
    </section>
  );
}
