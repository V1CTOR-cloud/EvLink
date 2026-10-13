type SectionHeadingProps = {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
};

export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div>
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          {eyebrow}
        </p>
      )}

      <h2
        id={id}
        className="mt-1 text-xl font-semibold tracking-tight"
      >
        {title}
      </h2>

      {description && (
        <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}