'use client';

import Link from 'next/link';
import { Columns3, RotateCcw, Scale, Trash2 } from 'lucide-react';
import { useCompare } from '@/components/compare/CompareProvider';
import { CompareButton } from '@/components/compare/CompareButton';
import { DealButton } from '@/components/DealButton';
import { EmptyState } from '@/components/ui/EmptyState';
import { PriceBlock } from '@/components/ui/PriceBlock';
import { RatingStars } from '@/components/ui/RatingStars';
import { ScoreBadge } from '@/components/ui/ScoreBadge';
import { getProductById } from '@/data/products';
import { productPlaceholder } from '@/lib/placeholder';
import { getCategoryName } from '@/data/categories';
import {
  CANONICAL_SPEC_ORDER,
  isDroppedSpecLabel,
  normalizeSpecLabel,
} from '@/lib/specs';
import { cn } from '@/lib/cn';

export default function ComparePage() {
  const { selected, remove, clear } = useCompare();
  const products = selected
    .map((id) => getProductById(id))
    .filter((p) => p !== undefined);

  if (products.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
        <EmptyState
          title="Nothing to compare yet"
          description="Add up to 4 products to your compare list using the compare button on any product card, then come back here."
          action={
            <Link href="/products" className="btn-primary">
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Browse products
            </Link>
          }
        />
      </div>
    );
  }

  const specLabels = Array.from(
    new Set(
      products
        .flatMap((p) => p.specs.map((s) => s.label))
        .map((label) => normalizeSpecLabel(label))
        .filter((label) => !isDroppedSpecLabel(label)),
    ),
  );
  const specOrder = new Map(
    CANONICAL_SPEC_ORDER.map((label, index) => [label, index]),
  );
  const orderedSpecLabels = [
    ...specLabels
      .filter((label) => specOrder.has(label))
      .sort((a, b) => specOrder.get(a)! - specOrder.get(b)!),
    ...specLabels.filter((label) => !specOrder.has(label)),
  ].slice(0, 8);

  const rowMeta = [
    { label: 'Price', render: (id: string) => renderPrice(id) },
    { label: 'Rating', render: (id: string) => renderRating(id) },
    { label: 'UniSmart Score', render: (id: string) => renderScore(id) },
    { label: 'Recommendation', render: (id: string) => renderRecommendation(id) },
    { label: 'Best for', render: (id: string) => renderBullets(id) },
  ];

  function renderPrice(id: string) {
    const p = getProductById(id)!;
    return (
      <PriceBlock price={p.priceInr} previousPrice={p.previousPriceInr} size="sm" />
    );
  }
  function renderRating(id: string) {
    return <RatingStars rating={getProductById(id)!.rating} showValue />;
  }
  function renderScore(id: string) {
    return <ScoreBadge score={getProductById(id)!.uniSmartScore} />;
  }
  function renderRecommendation(id: string) {
    return (
      <p className="max-w-[180px] text-sm leading-relaxed text-slate-600">
        {getProductById(id)!.shortRecommendation}
      </p>
    );
  }
  function renderBullets(id: string) {
    return (
      <ul className="space-y-1.5">
        {getProductById(id)!.bestFor.slice(0, 2).map((item) => (
          <li key={item} className="flex items-start gap-1.5 text-sm text-slate-600">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-indigo-500" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="py-10 sm:py-14">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="eyebrow mb-3">
              <Columns3 className="h-3.5 w-3.5" aria-hidden="true" />
              Side by side
            </span>
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Compare products
            </h1>
            <p className="mt-2 max-w-xl text-slate-600">
              {products.length} {products.length === 1 ? 'product' : 'products'}
              selected. Add or remove products to narrow down your choice.
            </p>
          </div>
          <button type="button" onClick={clear} className="btn-secondary">
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            Clear all
          </button>
        </div>

        <div className="mt-8 overflow-x-auto rounded-2xl border border-slate-200 shadow-card">
          <table className="w-full min-w-[760px] border-collapse text-sm">
            <caption className="sr-only">
              Comparison table for {products.map((p) => p.name).join(', ')}
            </caption>
            <thead>
              <tr className="border-b border-slate-200">
                <th scope="col" className="sticky left-0 z-10 bg-slate-50 px-4 py-4 text-left align-bottom text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Product
                </th>
                {products.map((product) => (
                  <th scope="col" key={product.id} className="bg-white px-4 py-4 text-left align-top">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/products/${product.slug}`}
                        className="flex items-center gap-3"
                      >
                        <img
                          src={product.image ?? productPlaceholder(product.name, product.category)}
                          alt=""
                          className="h-12 w-16 shrink-0 rounded-xl object-cover"
                        />
                        <span className="font-display text-sm font-bold leading-snug text-slate-900 hover:text-indigo-600">
                          {product.name}
                        </span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => remove(product.id)}
                        className="rounded-lg p-1 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                        aria-label={`Remove ${product.name} from compare`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <Link
                        href={`/products?category=${product.category}`}
                        className="text-xs font-medium text-indigo-600"
                      >
                        {getCategoryName(product.category)}
                      </Link>
                      <span className="text-slate-300">·</span>
                      <span className="text-xs text-slate-500">{product.brand}</span>
                    </div>
                    <div className="mt-3 flex flex-col gap-2">
                      <DealButton
                        href={product.deals[0]?.url ?? '#'}
                        size="sm"
                        label="View Deal"
                        className="w-full"
                      />
                      <CompareButton productId={product.id} variant="full" />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rowMeta.map((row, rowIndex) => (
                <tr key={row.label} className={cn(rowIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50/60')}>
                  <th
                    scope="row"
                    className={cn(
                      'sticky left-0 z-10 px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-400',
                      rowIndex % 2 === 0 ? 'bg-slate-50' : 'bg-slate-100/80',
                    )}
                  >
                    {row.label}
                  </th>
                  {products.map((product) => (
                    <td key={product.id} className="px-4 py-3.5 align-top">
                      {row.render(product.id)}
                    </td>
                  ))}
                </tr>
              ))}
              {orderedSpecLabels.map((label, labelIndex) => (
                <tr key={label} className={cn(labelIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50/60')}>
                  <th
                    scope="row"
                    className={cn(
                      'sticky left-0 z-10 px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-400',
                      labelIndex % 2 === 0 ? 'bg-slate-50' : 'bg-slate-100/80',
                    )}
                  >
                    {label}
                  </th>
                  {products.map((product) => {
                    const matches = product.specs
                      .filter((s) => normalizeSpecLabel(s.label) === label)
                      .sort((a, b) => b.value.length - a.value.length);
                    return (
                      <td key={product.id} className="px-4 py-3.5 text-slate-700">
                        {matches[0]?.value ?? '—'}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 flex items-center gap-2 text-xs text-slate-400">
          <Scale className="h-3.5 w-3.5" aria-hidden="true" />
          Comparison uses the specs and ratings shown on each product page — always confirm details on the merchant site before buying.
        </p>

        <div className="mt-8">
          <Link href="/products" className="btn-link">
            Add more products to compare
          </Link>
        </div>
      </div>
    </div>
  );
}