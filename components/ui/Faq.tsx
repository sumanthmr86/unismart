import { ChevronDown } from 'lucide-react';

export function Faq({
  items,
  title = 'Frequently asked questions',
}: {
  items: { q: string; a: string }[];
  title?: string;
}) {
  if (items.length === 0) return null;
  return (
    <section aria-labelledby="faq-heading" className="mt-4">
      <h2 id="faq-heading" className="text-xl font-bold tracking-tight text-slate-900">
        {title}
      </h2>
      <div className="mt-4 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
        {items.map((item) => (
          <details
            key={item.q}
            className="group px-5 py-4"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-slate-900 marker:hidden">
              {item.q}
              <ChevronDown
                className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-open:rotate-180"
                aria-hidden="true"
              />
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}