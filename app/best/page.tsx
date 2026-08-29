import type { Metadata } from 'next';
import Link from 'next/link';
import { BadgeCheck, TrendingUp } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { PageHero } from '@/components/ui/PageHero';
import { getCategoryName } from '@/data/categories';
import { ROUNDUPS } from '@/data/roundups';

export const metadata: Metadata = {
  title: 'Best Picks & Roundups for Indian Students',
  description:
    'Our best-of roundups: the top earbuds, laptops, smartwatches, chargers and more — ranked by UniSmart Score with live Amazon prices.',
};

function roundupMeta(roundup: (typeof ROUNDUPS)[number]) {
  const category =
    roundup.category === 'all' ? null : getCategoryName(roundup.category);
  return { label: category ?? 'Everyday tech' };
}

export default function BestPicksPage() {
  return (
    <div className="py-10 sm:py-14">
      <div className="container-page">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Best picks', href: '/best' },
            { label: 'Roundups' },
          ]}
        />

        <PageHero
          eyebrow="Best-of roundups"
          title="Best picks in every budget"
          description="We rank the top products in the categories students actually buy — by our UniSmart Score, not by who pays for a banner. Prices are live from Amazon and refresh several times a day."
        />

        <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {ROUNDUPS.map((roundup) => {
            const { label } = roundupMeta(roundup);
            return (
              <li key={roundup.slug}>
                <Link
                  href={`/best/${roundup.slug}`}
                  className="card group flex h-full flex-col p-5 transition-shadow hover:shadow-elevate"
                >
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-indigo-600">
                    <BadgeCheck className="h-4 w-4" aria-hidden="true" />
                    {label}
                    {roundup.maxPrice !== undefined && (
                      <span className="ml-1 rounded-full bg-indigo-50 px-2 py-0.5 normal-case text-indigo-700">
                        Under ₹{roundup.maxPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </span>
                  <h2 className="mt-2 font-display text-base font-bold leading-snug text-slate-900 transition-colors group-hover:text-indigo-600">
                    {roundup.title}
                  </h2>
                  <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-slate-600">
                    {roundup.metaDescription}
                  </p>
                  <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600">
                    <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
                    See the ranked list
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>

        <p className="mt-10 text-sm text-slate-500">
          Prices and stock move fast. Ran{' '}
          <Link href="/products" className="font-semibold text-indigo-600 hover:underline">
            the full product catalogue
          </Link>{' '}
          or explore a{' '}
          <Link href="/vs" className="font-semibold text-indigo-600 hover:underline">
            head-to-head comparison
          </Link>
          .
        </p>
      </div>
    </div>
  );
}