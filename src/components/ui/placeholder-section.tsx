// Segnaposto delle sezioni non ancora costruite. Dice cosa arriverà,
// senza contenuti finti.
export function PlaceholderSection({
  title,
  children,
  milestone,
}: {
  title: string;
  children: React.ReactNode;
  milestone: string;
}) {
  return (
    <section className="rounded-card border-2 border-line bg-surface p-5 shadow-card">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-lg">{title}</h2>
        <span className="font-display-narrow shrink-0 text-xs uppercase text-muted">
          {milestone}
        </span>
      </div>
      <div className="mt-2 text-sm text-muted">{children}</div>
    </section>
  );
}
