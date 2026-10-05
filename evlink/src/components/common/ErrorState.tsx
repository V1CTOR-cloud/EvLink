type ErrorStateProps = {
  message?: string;
};

export function ErrorState({
  message = "Ha ocurrido un error.",
}: ErrorStateProps) {
  return (
    <div className="rounded-md border p-4">
      <p className="text-sm text-destructive">{message}</p>
    </div>
  );
}
