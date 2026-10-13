import {
  CircleX,
  CreditCard,
  TriangleAlert,
  Zap,
} from "lucide-react";

import type { AdminDashboardMetrics } from "@/services/admin-dashboard";

import { AttentionCard } from "./AttentionCard";
import { SectionHeading } from "./SectionHeading";

type AdminDashboardPrioritiesProps = {
  metrics: AdminDashboardMetrics;
};

export function AdminDashboardPriorities({
  metrics,
}: AdminDashboardPrioritiesProps) {
  const incidentCount = metrics.incidents.data?.total ?? null;
  const failedSessions = metrics.sessions.data?.failed ?? null;
  const pendingPayments = metrics.payments.data?.pending ?? null;
  const failedPayments = metrics.payments.data?.failed ?? null;

  const incidentDescription =
    incidentCount === null
      ? "No se ha podido obtener el número de incidencias."
      : incidentCount === 0
        ? "No hay incidencias registradas actualmente."
        : "Revisa las incidencias que requieren seguimiento.";

  return (
    <section aria-labelledby="admin-priorities-title" className="space-y-4">
      <SectionHeading
        id="admin-priorities-title"
        eyebrow="Centro de atención"
        title="Requieren atención"
        description="Elementos que conviene revisar para mantener la plataforma bajo control."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AttentionCard
          label="Incidencias"
          description={incidentDescription}
          value={incidentCount}
          severity="danger"
          icon={TriangleAlert}
          href={
            incidentCount !== null && incidentCount > 0
              ? "#admin-incidents-title"
              : undefined
          }
        />

        <AttentionCard
          label="Sesiones fallidas"
          description={
            failedSessions === null
              ? "No se han podido cargar las sesiones."
              : failedSessions === 0
                ? "No hay sesiones fallidas registradas."
                : "Consulta las sesiones que han terminado con error."
          }
          value={failedSessions}
          severity="danger"
          icon={Zap}
          href={
            failedSessions !== null && failedSessions > 0
              ? "/admin/sessions?status=failed"
              : undefined
          }
        />

        <AttentionCard
          label="Pagos pendientes"
          description={
            pendingPayments === null
              ? "No se han podido cargar los pagos."
              : pendingPayments === 0
                ? "No hay pagos pendientes."
                : "Comprueba los pagos que esperan procesamiento."
          }
          value={pendingPayments}
          severity="warning"
          icon={CreditCard}
          href={
            pendingPayments !== null && pendingPayments > 0
              ? "/admin/payments?status=pending"
              : undefined
          }
        />

        <AttentionCard
          label="Pagos fallidos"
          description={
            failedPayments === null
              ? "No se han podido cargar los pagos."
              : failedPayments === 0
                ? "No hay pagos fallidos registrados."
                : "Revisa los pagos que no se han completado."
          }
          value={failedPayments}
          severity="danger"
          icon={CircleX}
          href={
            failedPayments !== null && failedPayments > 0
              ? "/admin/payments?status=failed"
              : undefined
          }
        />
      </div>
    </section>
  );
}