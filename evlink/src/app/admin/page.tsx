import { ShieldCheck } from "lucide-react";

export default function AdminPage() {
  return (
    <section className="p-4 sm:p-6">
      <div className="mx-auto max-w-5xl space-y-10">
        <header className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted">
            <ShieldCheck
              aria-hidden="true"
              className="size-5 text-muted-foreground"
            />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Administración
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Gestiona usuarios y estaciones de recarga de EvLink.
            </p>
          </div>
        </header>
      </div>
    </section>
  );
}