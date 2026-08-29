import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CheckCircle2, RefreshCw, Swords, Trophy } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Faq } from '@/components/ui/Faq';
import { PageHero } from '@/components/ui/PageHero';
import { PriceBlock } from '@/components/ui/PriceBlock';
import { RatingStars } from '@/components/ui/RatingStars';
import { ScoreBadge } from '@/components/ui/ScoreBadge';
import { DealButton } from '@/components/DealButton';
import { GuideProductRef } from '@/components/GuideProductRef';
import { COMPARISONS, getComparisonBySlug } from '@/data/comparisons';
import { getProductBySlug } from '@/data/products';
import { formatINR } from '@/lib/format';
import { productPlaceholder } from '@/lib/placeholder';
import { normalizeSpecLabel } from '@/lib/specs';
import { SITE_URL } from '@/lib/site';
import type { Product } from '@/lib/types';
import { cn } from '@/lib/cn';

interface VsPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return COMPARISONS.map((comparison) => ({ slug: comparison.slug }));
}

export async function generateMetadata({
  params,
}: VsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const comparison = getComparisonBySlug(slug);
  if (!comparison) return { title: 'Comparison not found' };
  return {
    title: comparison.metaTitle,
    description: comparison.metaDescription,
    openGraph: {
      type: 'website',
      title: comparison.metaTitle,
      description: comparison.metaDescription,
      url: `${SITE_URL}/vs/${comparison.slug}`,
    },
  };
}

function mergedSpecRows(first: Product, second: Product) {
  const rows: { label: string; a: string; b: string }[] = [];
  const seen = new Set<string>();
  const secondByLabel = new Map<string, string>();
  for (const spec of second.specs) {
    secondByLabel.set(normalizeSpecLabel(spec.label), spec.value);
  }

  for (const spec of first.specs) {
    const normalized = normalizeSpecLabel(spec.label);
    if (seen.has(normalized)) continue;
    seen.add(normalized);
    rows.push({
      label: normalized,
      a: spec.value,
      b: secondByLabel.get(normalized) ?? '—',
    });
  }
  for (const spec of second.specs) {
    const normalized = normalizeSpecLabel(spec.label);
    if (seen.has(normalized)) continue;
    seen.add(normalized);
    rows.push({ label: normalized, a: '—', b: spec.value });
  }
  return rows;
}

export default async function VsPage({ params }: VsPageProps) {
  const { slug } = await params;
  const comparison = getComparisonBySlug(slug);
  if (!comparison) return notFound();

  const first = getProductBySlug(comparison.productIds[0]);
  const second = getProductBySlug(comparison.productIds[1]);
  if (!first || !second) return notFound();

  const specRows = mergedSpecRows(first, second);
  const related = COMPARISONS.filter((c) => c.id !== comparison.id).slice(0, 3);

  return (
    <main className="py-10 sm:py-14">
      <div className="container-page">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Comparisons', href: '/vs' },
            { label: `${first.brand} vs ${second.brand}` },
          ]}
        />

        <PageHero
          eyebrow="Head-to-head comparison"
          title={`${first.name} vs ${second.name}`}
          description={comparison.metaDescription}
        />

        {/* Contestants */}
        <div className="grid gap-5 sm:grid-cols-2">
          {[first, second].map((product) => (
            <article key={product.id} className="card flex flex-col overflow-hidden">
              <Link
                href={`/products/${product.slug}`}
                className="relative block overflow-hidden"
              >
                <img
                  src={product.image ?? productPlaceholder(product.name, product.category)}
                  alt={product.name}
                  width={640}
                  height={360}
                  loading="lazy"
                  className="aspect-[16/9] w-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <ScoreBadge
                  score={product.uniSmartScore}
                  className="absolute right-2.5 top-2.5"
                />
              </Link>
              <div className="flex flex-1 flex-col p-4">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-indigo-600">
                  <Swords className="h-3.5 w-3.5" aria-hidden="true" />
                  {product.brand}
                </span>
                <h1 className="mt-1 font-display text-lg font-bold leading-snug text-slate-900">
                  {product.name}
                </h1>
                <div className="mt-2">
                  <PriceBlock
                    price={product.priceInr}
                    previousPrice={product.previousPriceInr}
                    size="md"
                    showSavings
                  />
                </div>
                <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
                  <RatingStars rating={product.rating} showValue />
                  <span>{product.ratingCount.toLocaleString('en-IN')} ratings</span>
                </div>
                {product.priceUpdatedOn && (
                  <p className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700">
                    <RefreshCw className="h-3 w-3" aria-hidden="true" />
                    Live price synced from Amazon
                  </p>
                )}
                <div className="mt-auto flex items-center gap-2 pt-4">
                  <DealButton
                    href={product.deals[0]?.url ?? '#'}
                    label="View Deal"
                    size="sm"
                    className="flex-1"
                  />
                  <Link
                    href={`/products/${product.slug}`}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    Full review
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Intro */}
        <div className="prose-unismart mt-10 max-w-3xl">
          <p>{comparison.intro}</p>
        </div>

        {/* Spec table */}
        <section className="mt-12" aria-labelledby="spec-table-heading">
          <h2
            id="spec-table-heading"
            className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl"
          >
            At a glance
          </h2>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
            <table className="w-full min-w-[540px] text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Spec
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">
                    {first.brand}
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">
                    {second.brand}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {specRows.map((row) => (
                  <tr key={row.label}>
                    <td className="px-4 py-3 font-medium text-slate-500">{row.label}</td>
                    <td className="px-4 py-3 text-slate-700">{row.a}</td>
                    <td className="px-4 py-3 text-slate-700">{row.b}</td>
                  </tr>
                ))}
                <tr className="bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-500">
                    Current price{' '}
                    <span className="font-normal normal-case text-slate-400">
                      (live)
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-900">
                    {formatINR(first.priceInr)}
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-900">
                    {formatINR(second.priceInr)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Key differences */}
        <section className="mt-12" aria-labelledby="differences-heading">
          <h2
            id="differences-heading"
            className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl"
          >
            Key differences
          </h2>
          <ul className="mt-4 space-y-3">
            {comparison.keyDifferences.map((difference, index) => (
              <li
                key={difference}
                className="card flex items-start gap-3 p-4"
              >
                <span
                  className={cn(
                    'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                    index % 2 === 0
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'bg-violet-50 text-violet-600',
                  )}
                >
                  {index + 1}
                </span>
                <p className="text-sm leading-relaxed text-slate-700">
                  {difference}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* Verdict */}
        <section className="mt-12" aria-labelledby="verdict-heading">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 p-6 text-white sm:p-8">
            <div
              className="pointer-events-none absolute inset-0"
              aria-hidden="true"
              style={{
                background:
                  'radial-gradient(30rem 14rem at 85% -20%, rgb(255 255 255 / 0.2), transparent 60%)',
              }}
            />
            <div className="relative">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold">
                <Trophy className="h-3.5 w-3.5" aria-hidden="true" />
                Our verdict
              </span>
              <h2
                id="verdict-heading"
                className="mt-4 font-display text-2xl font-bold tracking-tight"
              >
                {comparison.verdict}
              </h2>
            </div>
          </div>
        </section>

        {/* Winners */}
        <section className="mt-12" aria-labelledby="picks-heading">
          <h2
            id="picks-heading"
            className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl"
          >
            The winner by use case
          </h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {comparison.picks.map((pick) => {
              const product = getProductBySlug(pick.productId);
              if (!product) return null;
              return (
                <li key={pick.label} className="card flex flex-col p-5">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-emerald-600">
                    <Trophy className="h-4 w-4" aria-hidden="true" />
                    {pick.label}
                  </span>
                  <p className="mt-2 font-display text-base font-bold text-slate-900">
                    {product.name}
                  </p>
                  <p className="mt-1.5 text-sm text-slate-600">{pick.reason}</p>
                  <div className="mt-3">
                    <PriceBlock
                      price={product.priceInr}
                      previousPrice={product.previousPriceInr}
                      size="sm"
                    />
                  </div>
                  <div className="mt-4">
                    <DealButton
                      href={product.deals[0]?.url ?? '#'}
                      label={`Buy ${product.brand}`}
                      size="sm"
                      className="w-full"
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        {/* FAQ */}
        <div className="mt-12 max-w-3xl">
          <Faq items={comparison.faq} title="FAQs about this comparison" />
        </div>

        {/* Caveat */}
        <p className="mt-8 flex items-start gap-2 text-xs text-slate-400">
          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>
            Prices and offers change daily on Amazon — these figures update
            automatically several times a day. Tap “View Deal” to confirm today’s
            price, coupon and warranty before you buy.
          </span>
        </p>

        {/* Related */}
        <section className="mt-14" aria-labelledby="related-heading">
          <h2
            id="related-heading"
            className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl"
          >
            More comparisons
          </h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {related.map((item) => {
              const relatedFirst = getProductBySlug(item.productIds[0]);
              const relatedSecond = getProductBySlug(item.productIds[1]);
              return (
                <Link
                  key={item.id}
                  href={`/vs/${item.slug}`}
                  className="card group flex items-center gap-4 p-4 transition-shadow hover:shadow-elevate"
                >
                  {relatedFirst && relatedSecond && (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-700">
                      {relatedFirst.brand}
                      <Swords className="h-3 w-3 text-indigo-600" aria-hidden="true" />
                      {relatedSecond.brand}
                    </span>
                  )}
                  <span className="text-sm font-semibold text-slate-800 transition-colors group-hover:text-indigo-600">
                    {item.picks[0]?.label ?? 'Read comparison'}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Product references inline */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          <GuideProductRef productId={first.id} />
          <GuideProductRef productId={second.id} />
        </div>
      </div>
    </main>
  );
}