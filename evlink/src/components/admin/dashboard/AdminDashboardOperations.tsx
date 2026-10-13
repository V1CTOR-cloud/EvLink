import type { AdminDashboardMetrics } from "@/services/admin-dashboard";

import { CapacityCard } from "./CapacityCard";
import { PaymentSummary } from "./PaymentSummary";
import { SectionHeading } from "./SectionHeading";

type AdminDashboardOperationsProps = {
  metrics: AdminDashboardMetrics;
};

export function AdminDashboardOperations({
  metrics,
}: AdminDashboardOperationsProps) {
  return (
    <section aria-labelledby="admin-operations-title" className="space-y-4">
      <SectionHeading
        id="admin-operations-title"
        eyebrow="Operaciones"
        title="Capacidad y pagos"
        description="Consulta la capacidad disponible de la infraestructura y el estado de los pagos."
      />

      <div className="grid gap-4 xl:grid-cols-2">
        <CapacityCard
          stations={metrics.stations.data}
          connectors={metrics.connectors.data}
        />

        <PaymentSummary payments={metrics.payments.data} />
      </div>
    </section>
  );
}
