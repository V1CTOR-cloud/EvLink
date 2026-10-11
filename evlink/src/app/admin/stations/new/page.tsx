import Link from "next/link";
import { ArrowLeft, MapPin } from "lucide-react";

import { ChargingStationForm } from "@/components/admin/ChargingStationForm";
import { requireAdmin } from "@/lib/auth/require-admin";

export default async function NewAdminStationPage() {
  await requireAdmin();

  return (
    <section className="p-4 sm:p-6">
      <div className="mx-auto max-w-5xl space-y-10">
        <Link
          href="/admin/stations"
          className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
          Estaciones
        </Link>

        <header className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted">
            <MapPin className="size-5 text-muted-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Nueva estación
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Añade los datos de ubicación y disponibilidad.
            </p>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-3 lg:gap-10">
          <div>
            <h2 className="text-sm font-semibold">Datos de la estación</h2>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Completa la información necesaria para registrar esta ubicación.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 sm:p-5 lg:col-span-2">
            <ChargingStationForm />
          </div>
        </section>
      </div>
    </section>
  );
}
