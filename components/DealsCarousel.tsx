'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { cn } from '@/lib/cn';
import type { Product } from '@/lib/types';

const AUTOPLAY_MS = 4500;
const GAP_PX = 20;

export function DealsCarousel({
  products,
  headline = { eyebrow: "Today's best deals", title: 'Deals worth a second look' },
  className,
}: {
  products: Product[];
  headline?: { eyebrow?: string; title: string; subtitle?: string; href?: string };
  className?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [pageCount, setPageCount] = useState(1);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const lastIndexRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const measure = () => {
      const card = track.querySelector<HTMLElement>('[data-slide]');
      if (!card) return;
      const step = card.offsetWidth + GAP_PX;
      const visible = Math.max(1, Math.round(track.clientWidth / step));
      setPageCount(Math.max(1, products.length - visible + 1));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    return () => observer.disconnect();
  }, [products.length]);

  const displayIndex =
    pageCount > 0 ? ((index % pageCount) + pageCount) % pageCount : 0;

  useEffect(() => {
    const track = trackRef.current;
    const card = track?.querySelector<HTMLElement>('[data-slide]');
    if (!track || !card) return;

    const step = card.offsetWidth + GAP_PX;
    const wrapped =
      lastIndexRef.current !== 0 && displayIndex === 0 && pageCount > 1;
    track.scrollTo({
      left: displayIndex * step,
      behavior: wrapped ? 'auto' : 'smooth',
    });
    lastIndexRef.current = displayIndex;
  }, [displayIndex, pageCount]);

  useEffect(() => {
    if (paused || pageCount <= 1) return;
    const id = window.setTimeout(() => {
      setIndex((i) => i + 1);
    }, AUTOPLAY_MS);
    return () => window.clearTimeout(id);
  }, [index, paused, pageCount]);

  const goToPage = useCallback(
    (page: number) => {
      const track = trackRef.current;
      const card = track?.querySelector<HTMLElement>('[data-slide]');
      if (!track || !card) return;
      const step = card.offsetWidth + GAP_PX;
      const max = pageCount - 1;
      const target = Math.max(0, Math.min(page, max));
      setIndex(target);
      track.scrollTo({ left: target * step, behavior: 'smooth' });
      lastIndexRef.current = target;
    },
    [pageCount],
  );

  const handleScroll = () => {
    const track = trackRef.current;
    const card = track?.querySelector<HTMLElement>('[data-slide]');
    if (!track || !card) return;
    const step = card.offsetWidth + GAP_PX;
    const page = Math.round(track.scrollLeft / step);
    if (page >= 0) {
      setIndex(Math.min(Math.max(page, 0), pageCount - 1));
    }
  };

  const hasPages = pageCount > 1;
  const atStart = displayIndex === 0;
  const atEnd = displayIndex === pageCount - 1;

  return (
    <section className="py-16 sm:py-20" aria-label="Today's best deals">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow={headline.eyebrow}
            title={headline.title}
            subtitle={headline.subtitle}
            href={headline.href}
            linkLabel="View all deals"
            className="mb-0 max-w-2xl"
          />
          {hasPages && (
            <div className="mb-1 flex items-center gap-2">
              <button
                type="button"
                onClick={() => goToPage(displayIndex - 1)}
                disabled={atStart}
                aria-label="Previous deals"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-indigo-300 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => goToPage(displayIndex + 1)}
                disabled={atEnd}
                aria-label="Next deals"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-indigo-300 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>

        <div
          ref={trackRef}
          onScroll={handleScroll}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
          className={cn(
            'flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 scroll-px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
            className,
          )}
        >
          {products.map((product) => (
            <div
              key={product.id}
              data-slide
              className="w-11/12 shrink-0 snap-start sm:w-[calc(50%-10px)] xl:w-[calc((100%-40px)/3)]"
            >
              <ProductCard product={product} className="h-full" />
            </div>
          ))}
        </div>

        {hasPages && (
          <div className="mt-3 flex items-center justify-center gap-2">
            {Array.from({ length: pageCount }).map((_, dot) => (
              <button
                key={dot}
                type="button"
                onClick={() => goToPage(dot)}
                aria-label={`Go to deals page ${dot + 1}`}
                aria-current={dot === displayIndex}
                className={cn(
                  'h-2.5 rounded-full transition-all',
                  dot === displayIndex
                    ? 'w-7 bg-indigo-600'
                    : 'w-2.5 bg-slate-300 hover:bg-slate-400',
                )}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}