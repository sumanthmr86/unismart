'use client';

import Link from 'next/link';
import { ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { CompareButton } from '@/components/compare/CompareButton';
import { DealButton } from '@/components/DealButton';
import { PriceBlock } from '@/components/ui/PriceBlock';
import { RatingStars } from '@/components/ui/RatingStars';
import { ScoreBadge } from '@/components/ui/ScoreBadge';
import { discountPercent } from '@/lib/format';
import { productPlaceholder } from '@/lib/placeholder';
import { getCategoryName } from '@/data/categories';
import type { Product } from '@/lib/types';
import { cn } from '@/lib/cn';
import { useState, useRef, useEffect } from 'react';

export function ProductCard({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) {
  const discount = discountPercent(product.priceInr, product.previousPriceInr);
  const dealUrl = product.deals[0]?.url ?? '#';
  const categoryName = getCategoryName(product.category);
  const [imageIndex, setImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const images = product.images && product.images.length > 0 ? product.images : [product.image ?? productPlaceholder(product.name, product.category)];
  const hasMultipleImages = images.length > 1;
  const swipeRef = useRef<HTMLDivElement>(null);

  // Auto-advance carousel on hover (desktop)
  useEffect(() => {
    if (!hasMultipleImages || !isHovered) return;
    const interval = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isHovered, hasMultipleImages, images.length]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!hasMultipleImages) return;
    if (e.key === 'ArrowLeft') setImageIndex((prev) => (prev - 1 + images.length) % images.length);
    if (e.key === 'ArrowRight') setImageIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <article
      className={cn(
        'card group relative flex flex-col overflow-hidden transition-shadow hover:shadow-elevate',
        'active:scale-[0.99] transition-transform duration-75',
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative" onKeyDown={handleKeyDown} tabIndex={0} ref={swipeRef}>
        <Link
          href={`/products/${product.slug}`}
          className="block overflow-hidden"
          aria-label={product.name}
        >
          <div className="aspect-[4/3] w-full overflow-hidden relative">
            <img
              src={images[imageIndex]}
              alt={`${product.name} — product image ${imageIndex + 1} of ${images.length}`}
              width={640}
              height={480}
              loading="lazy"
              className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {hasMultipleImages && (
              <>
                {/* Swipe indicator */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <ChevronLeft className="h-3 w-3" aria-hidden="true" />
                  <span className="font-mono">{imageIndex + 1} / {images.length}</span>
                  <ChevronRight className="h-3 w-3" aria-hidden="true" />
                </div>
                {/* Touch swipe area */}
                <div className="absolute inset-0" aria-hidden="true" />
              </>
            )}
          </div>
        </Link>
        {discount > 0 && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-lg bg-rose-600 px-2 py-1 text-xs font-bold text-white shadow-sm animate-pulse">
            <ArrowDown className="h-3 w-3" aria-hidden="true" />
            {discount}% off
          </span>
        )}
        <div className="absolute right-3 top-3 flex flex-col gap-2">
          <ScoreBadge
            score={product.uniSmartScore}
            className="shadow-sm"
            compact
          />
          {product.featured && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-amber-500 px-2 py-1 text-xs font-bold text-white shadow-sm">
              <span className="animate-bounce" aria-hidden="true">★</span>
              Featured
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <div className="mb-1.5 flex items-center justify-between gap-2">
          <Link
            href={`/products?category=${product.category}`}
            className="inline-flex min-w-0 items-center gap-1 truncate text-xs font-medium text-indigo-600 hover:text-indigo-800"
          >
            <span className="h-3 w-3 shrink-0 rounded-full bg-indigo-100 flex items-center justify-center" aria-hidden="true">
              <span className="text-[8px] font-bold text-indigo-700">{categoryName.charAt(0)}</span>
            </span>
            <span className="truncate">{categoryName}</span>
          </Link>
          <span className="shrink-0">
            <RatingStars rating={product.rating} showValue />
          </span>
        </div>

        <h3 className="font-display text-sm font-semibold leading-snug text-slate-900 sm:text-[15px]">
          <Link
            href={`/products/${product.slug}`}
            className="line-clamp-2 transition-colors hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded"
          >
            {product.name}
          </Link>
        </h3>

        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
          {product.shortRecommendation}
        </p>

        <div className="mt-3">
          <PriceBlock
            price={product.priceInr}
            previousPrice={product.previousPriceInr}
            size="sm"
            showSavings={false}
          />
        </div>

        <div className="mt-auto grid grid-cols-[1fr_auto] items-center gap-2 pt-3 sm:pt-4">
          <DealButton
            href={dealUrl}
            label="View Deal"
            size="sm"
            className="h-11 w-full min-w-0 touch-manipulation"
          />
          <CompareButton productId={product.id} className="touch-manipulation" />
        </div>
        <Link
          href={`/products/${product.slug}`}
          className="mt-2 hidden text-center text-xs font-medium text-slate-500 underline-offset-2 transition hover:text-indigo-600 hover:underline sm:block"
        >
          View details
        </Link>
      </div>
    </article>
  );
}