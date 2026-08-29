'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Flame, TrendingDown } from 'lucide-react';
import { discountPercent, formatINR, savingsInr } from '@/lib/format';
import { productPlaceholder } from '@/lib/placeholder';
import { getCategoryName } from '@/data/categories';
import type { Product } from '@/lib/types';
import { cn } from '@/lib/cn';

const SLIDE_MS = 6000;

export function DealOfTheDaySlider({ deals }: { deals: Product[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = deals.length;

  useEffect(() => {
    if (paused || total <= 1) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % total),
      SLIDE_MS,
    );
    return () => clearInterval(id);
  }, [paused, total]);

  if (total === 0) return null;

  const go = (dir: number) =>
    setIndex((i) => (i + dir + total) % total);

  return (
    <section className="container-page -mt-6 pb-4 sm:-mt-10" aria-label="Deal of the day">
      <div
        className="relative overflow-hidden rounded-2xl bg-slate-950 text-white shadow-elevate sm:rounded-3xl"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              'radial-gradient(42rem 18rem at 8% 0%, rgb(217 70 239 / 0.25), transparent 55%), radial-gradient(36rem 20rem at 95% 100%, rgb(79 70 229 / 0.35), transparent 55%)',
          }}
        />

        <div
          className="relative flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {deals.map((deal) => (
            <DealSlide key={deal.id} deal={deal} />
          ))}
        </div>

        {total > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous deal"
              className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-slate-900/60 text-white backdrop-blur transition-colors hover:bg-white hover:text-slate-900"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next deal"
              className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-slate-900/60 text-white backdrop-blur transition-colors hover:bg-white hover:text-slate-900"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5">
              {deals.map((deal, i) => (
                <button
                  key={deal.id}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Show deal ${i + 1}`}
                  className={cn(
                    'h-1.5 rounded-full transition-all',
                    i === index ? 'w-5 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/70',
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function DealSlide({ deal }: { deal: Product }) {
  const discount = discountPercent(deal.priceInr, deal.previousPriceInr);
  const savings = savingsInr(deal.priceInr, deal.previousPriceInr);

  return (
    <Link
      href={`/products/${deal.slug}`}
      className="group relative w-full shrink-0 basis-full overflow-hidden px-1 py-1.5 sm:px-2 sm:py-2"
      aria-label={`View deal: ${deal.name}`}
    >
      <div className="grid gap-6 p-6 sm:grid-cols-[9rem_1fr] sm:items-center sm:gap-8 sm:p-8">
        <div className="mx-auto w-40 overflow-hidden rounded-2xl bg-white/10 sm:mx-0 sm:w-full">
          <img
            src={deal.image ?? productPlaceholder(deal.name, deal.category)}
            alt=""
            width={288}
            height={216}
            loading="lazy"
            className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wide text-rose-300">
              <Flame className="h-3.5 w-3.5" aria-hidden="true" />
              Deal of the day
            </span>
            <h2 className="mt-3 font-display text-xl font-bold leading-snug tracking-tight sm:text-2xl">
              {deal.name}
            </h2>
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-300">
              {getCategoryName(deal.category)} · {deal.shortRecommendation}
            </p>
          </div>
          <div className="shrink-0 text-left sm:text-right">
            <p className="text-2xl font-extrabold text-emerald-300">
              {formatINR(deal.priceInr)}
            </p>
            <p className="mt-1 text-sm text-slate-400">
              <span className="line-through">
                {formatINR(deal.previousPriceInr)}
              </span>{' '}
              <span className="font-semibold text-rose-300">
                {discount}% off
              </span>
            </p>
            <p className="mt-1 text-xs font-medium text-slate-300">
              You save {formatINR(savings)}
            </p>
            <span className="mt-3 inline-flex items-center gap-1 rounded-lg bg-white px-4 py-2 text-sm font-bold text-slate-900 transition-colors group-hover:bg-emerald-500 group-hover:text-white">
              View deal
              <TrendingDown className="h-4 w-4" aria-hidden="true" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}