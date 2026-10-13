import Link from "next/link";
import { ArrowUpRight, CreditCard } from "lucide-react";

import {
  StatusBreakdown,
  type Segment,
} from "@/components/admin/AdminStatusBreakdown";
import type { AdminDashboardMetrics } from "@/services/admin-dashboard";

type PaymentSummaryProps = {
  payments: AdminDashboardMetrics["payments"]["data"];
};

export function PaymentSummary({ payments }: PaymentSummaryProps) {
  const segments: Segment[] = [
    {
      label: "Completados",
      value: payments?.completed ?? null,
      tone: "success",
    },
    {
      label: "Pendientes",
      value: payments?.pending ?? null,
      tone: "warning",
    },
    {
      label: "Fallidos",
      value: payments?.failed ?? null,
      tone: "danger",
    },
    {
      label: "Reembolsados",
      value: payments?.refunded ?? null,
      tone: "neutral",
    },
  ];

  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-background">
            <CreditCard className="size-5 text-muted-foreground" />
          </div>

          <div>
            <h3 className="font-semibold tracking-tight">
              Estado de los pagos
            </h3>
            <p className="mt-1 text-sm leading-5 text-muted-foreground">
              Distribución de las transacciones por estado.
            </p>
          </div>
        </div>

        <span className="text-2xl font-semibold tabular-nums">
          {payments
            ? payments.completed +
              payments.pending +
              payments.failed +
              payments.refunded
            : "—"}
        </span>
      </div>

      <div className="mt-6">
        <StatusBreakdown segments={segments} />
      </div>

      <p className="mt-4 text-xs leading-5 text-muted-foreground">
        Estas cifras representan el número de pagos por estado, no el importe
        monetario de las transacciones.
      </p>

      <Link
        href="/admin/payments"
        className="mt-5 flex items-center justify-between rounded-lg border border-border px-4 py-3 text-sm font-medium outline-none transition-colors hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        Ver todos los pagos
        <ArrowUpRight
          aria-hidden="true"
          className="size-4 text-muted-foreground"
        />
      </Link>
    </section>
  );
}
