'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Clock, Flame } from 'lucide-react';
import { ProductGrid } from '@/components/ProductGrid';
import type { Product } from '@/lib/types';

const ROTATE_MS = 6 * 60 * 60 * 1000;
const PAGE_SIZE = 3;

export function DealOfTheDay({ deals }: { deals: Product[] }) {
  const [windowIndex, setWindowIndex] = useState(0);
  const [now, setNow] = useState<number | null>(null);

  const windows = Math.max(1, Math.ceil(deals.length / PAGE_SIZE));

  useEffect(() => {
    const tick = () => {
      const t = Date.now();
      setNow(t);
      setWindowIndex(Math.floor(t / ROTATE_MS) % windows);
    };
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, [windows]);

  if (deals.length === 0) return null;

  const shown = deals.slice(
    windowIndex * PAGE_SIZE,
    windowIndex * PAGE_SIZE + PAGE_SIZE,
  );

  const nextChange = now ? ROTATE_MS - (now % ROTATE_MS) : ROTATE_MS;
  const hours = Math.floor(nextChange / 3_600_000);
  const minutes = Math.floor((nextChange % 3_600_000) / 60_000);

  return (
    <section className="py-16 sm:py-20" aria-labelledby="deal-of-day-heading">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-rose-600">
              <Flame className="h-3.5 w-3.5" aria-hidden="true" />
              Deal of the day
            </span>
            <h2
              id="deal-of-day-heading"
              className="mt-4 font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
            >
              Three live deals, rotating all day
            </h2>
            <p className="mt-2 text-sm text-slate-600 sm:text-base">
              Fresh offers shown here automatically — the set changes every 6
              hours and prices update from the latest Amazon data.
            </p>
          </div>
          <span
            className="inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700"
            title="Deals refresh every 6 hours"
          >
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            Next refresh in {hours}h {minutes}m
          </span>
        </div>

        <div className="mt-7">
          <ProductGrid products={shown} />
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          A new set of three appears every 6 hours — check back through the day.
        </p>
        <div className="mt-4 text-center">
          <Link
            href="/deals"
            className="chip transition-colors hover:border-indigo-300 hover:text-indigo-700"
          >
            See all deals
          </Link>
        </div>
      </div>
    </section>
  );
}