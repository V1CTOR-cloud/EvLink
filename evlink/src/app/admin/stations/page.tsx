
import Link from "next/link";

import { StationsExplorer } from "@/components/stations/StationsExplorer";
import { buttonVariants } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getChargingStations } from "@/services/charging-stations";
import { Plus } from "lucide-react";

export default async function AdminStationsPage() {
  const { supabase } = await requireAdmin();
  const stations = await getChargingStations(supabase);

  return (
    <section className="space-y-4 p-4 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Estaciones
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Explora las estaciones y gestiona sus datos y conectores.
          </p>
        </div>

        <Link
          href="/admin/stations/new"
          className={buttonVariants({ variant: "default" })}
        >
          <Plus />
          Nueva estación
        </Link>
      </div>

      <StationsExplorer stations={stations} mode="admin" />
    </section>
  );
}
