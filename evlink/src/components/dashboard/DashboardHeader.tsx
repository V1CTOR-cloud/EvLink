import { ArrowUpRight, MapPin } from "lucide-react";
import Link from "next/link";

type DashboardHeaderProps = {
  name: string;
  availableStations: number;
};

export function DashboardHeader({
  name,
  availableStations,
}: DashboardHeaderProps) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-border bg-card">
      <div className="absolute -right-24 -top-24 size-72 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 text-[11px] font-medium text-primary">
            <span className="size-1.5 rounded-full bg-primary" />
            EvLink conectado
          </div>

          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Buenos días, {name}
          </h1>

          <p className="mt-1.5 text-sm text-muted-foreground">
            Gestiona tus sesiones de carga y mantén tu movilidad bajo control.
          </p>
        </div>

        <Link
          href="/stations"
          className="group flex shrink-0 items-center gap-2.5 rounded-lg border border-border bg-background/70 px-3 py-2.5 transition-colors hover:border-primary/30 hover:bg-primary/5"
        >
          <div className="flex size-8 items-center justify-center rounded-md bg-primary/10">
            <MapPin className="size-4 text-primary" />
          </div>

          <div>
            <p className="text-[11px] text-muted-foreground">
              Estaciones disponibles
            </p>

            <p className="text-sm font-semibold">
              {availableStations} ahora mismo
            </p>
          </div>

          <ArrowUpRight className="ml-1 size-3.5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </section>
  );
}