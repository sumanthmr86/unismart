import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Scale, Swords } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { PageHero } from '@/components/ui/PageHero';
import { ScoreBadge } from '@/components/ui/ScoreBadge';
import { PriceBlock } from '@/components/ui/PriceBlock';
import { COMPARISONS } from '@/data/comparisons';
import { getProductBySlug } from '@/data/products';
import { productPlaceholder } from '@/lib/placeholder';
import { SITE_NAME } from '@/lib/site';
import type { Product } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Head-to-head comparisons — Which should you buy?',
  description:
    'Side-by-side comparisons of the products students actually debate — laptops, tablets, earbuds and backpacks, priced from Amazon live.',
};

export default function ComparisonsPage() {
  const comparisons = COMPARISONS.map((comparison) => {
    const [firstId, secondId] = comparison.productIds;
    const first = getProductBySlug(firstId);
    const second = getProductBySlug(secondId);
    return { comparison, first, second };
  }).filter(
    (
      entry,
    ): entry is {
      comparison: (typeof COMPARISONS)[number];
      first: Product;
      second: Product;
    } => Boolean(entry.first && entry.second),
  );

  return (
    <main className="py-10 sm:py-14">
      <div className="container-page">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Comparisons' }]} />

        <PageHero
          eyebrow="Head-to-head"
          title="Which one should you actually buy?"
          description="The product debates students have in every hostel — settled side by side. Real specs, live Amazon prices, one clear verdict."
        />

        <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {comparisons.map(({ comparison, first, second }) => (
            <li key={comparison.id}>
              <Link
                href={`/vs/${comparison.slug}`}
                className="card group flex h-full flex-col overflow-hidden transition-shadow hover:shadow-elevate"
              >
                <div className="grid grid-cols-2">
                  {[first, second].map((product) => (
                    <div key={product.id} className="relative">
                      <img
                        src={
                          product.image ??
                          productPlaceholder(product.name, product.category)
                        }
                        alt={product.name}
                        width={640}
                        height={400}
                        loading="lazy"
                        className="aspect-[4/3] w-full object-cover"
                      />
                      <ScoreBadge
                        score={product.uniSmartScore}
                        compact
                        className="absolute left-2.5 top-2.5"
                      />
                    </div>
                  ))}
                </div>
                <span className="absolute left-1/2 top-[26%] -translate-x-1/2 overflow-hidden rounded-full border border-slate-200 bg-white px-3 py-1 shadow-sm">
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-900">
                    <Swords className="h-3.5 w-3.5 text-indigo-600" aria-hidden="true" />
                    vs
                  </span>
                </span>

                <div className="flex flex-1 flex-col p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-indigo-600">
                    {first.brand} vs {second.brand}
                  </p>
                  <h2 className="mt-1 font-display text-base font-bold leading-snug text-slate-900 transition-colors group-hover:text-indigo-600">
                    {first.name} vs {second.name}
                  </h2>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">
                    {comparison.metaDescription}
                  </p>

                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div className="flex flex-col gap-1 text-xs text-slate-500">
                      <PriceBlock
                        price={first.priceInr}
                        previousPrice={first.previousPriceInr}
                        size="sm"
                      />
                      <PriceBlock
                        price={second.priceInr}
                        previousPrice={second.previousPriceInr}
                        size="sm"
                      />
                    </div>
                    <span className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-indigo-600">
                      Read verdict
                      <ArrowRight
                        className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-10 flex items-center justify-center gap-2 text-center text-sm text-slate-500">
          <Scale className="h-4 w-4 text-indigo-500" aria-hidden="true" />
          Prices shown are live from Amazon and refresh automatically. New
          comparisons land regularly — {SITE_NAME} settles the debates so you
          don’t have to.
        </p>
      </div>
    </main>
  );
}