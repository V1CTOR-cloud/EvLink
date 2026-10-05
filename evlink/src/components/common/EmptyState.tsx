type EmptyStateProps = {
  message?: string;
};

export function EmptyState({
  message = "No hay datos disponibles.",
}: EmptyStateProps) {
  return (
    <div className="rounded-md border p-4">
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
