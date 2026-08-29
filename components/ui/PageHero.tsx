export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-10 max-w-3xl">
      {eyebrow && <span className="eyebrow mb-3">{eyebrow}</span>}
      <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
        {title}
      </h1>
      {description && <p className="mt-3 text-lg text-slate-600">{description}</p>}
    </div>
  );
}