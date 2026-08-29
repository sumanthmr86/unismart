import Link from 'next/link';
import { ArrowDown, Tag } from 'lucide-react';
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

  return (
    <article
      className={cn(
        'card group relative flex flex-col overflow-hidden transition-shadow hover:shadow-elevate',
        className,
      )}
    >
      <div className="relative">
        <Link
          href={`/products/${product.slug}`}
          className="block overflow-hidden"
          aria-label={product.name}
        >
          <img
            src={product.image ?? productPlaceholder(product.name, product.category)}
            alt={`${product.name} — product image`}
            width={640}
            height={480}
            loading="lazy"
            className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        {discount > 0 && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-lg bg-rose-600 px-2 py-1 text-xs font-bold text-white shadow-sm">
            <ArrowDown className="h-3 w-3" aria-hidden="true" />
            {discount}% off
          </span>
        )}
        <ScoreBadge
          score={product.uniSmartScore}
          className="absolute right-3 top-3 shadow-sm"
          compact
        />
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <div className="mb-1.5 flex items-center justify-between gap-2">
          <Link
            href={`/products?category=${product.category}`}
            className="inline-flex min-w-0 items-center gap-1 truncate text-xs font-medium text-indigo-600 hover:text-indigo-800"
          >
            <Tag className="h-3 w-3 shrink-0" aria-hidden="true" />
            <span className="truncate">{categoryName}</span>
          </Link>
          <span className="shrink-0">
            <RatingStars rating={product.rating} showValue />
          </span>
        </div>

        <h3 className="font-display text-sm font-semibold leading-snug text-slate-900 sm:text-[15px]">
          <Link
            href={`/products/${product.slug}`}
            className="line-clamp-2 transition-colors hover:text-indigo-600"
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
          <DealButton href={dealUrl} label="View Deal" size="sm" className="h-10 w-full min-w-0" />
          <CompareButton productId={product.id} />
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