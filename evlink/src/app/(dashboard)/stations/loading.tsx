export default function Loading() {
  return (
    <section className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Estaciones</h1>

        <p className="text-muted-foreground">
          Cargando estaciones...
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-48 animate-pulse rounded-xl border bg-muted"
          />
        ))}
      </div>
    </section>
  );
}