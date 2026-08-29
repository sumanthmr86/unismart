import Link from 'next/link';
import { DealButton } from '@/components/DealButton';
import { CompareButton } from '@/components/compare/CompareButton';
import { PriceBlock } from '@/components/ui/PriceBlock';
import { ScoreBadge } from '@/components/ui/ScoreBadge';
import { productPlaceholder } from '@/lib/placeholder';
import { getProductById } from '@/data/products';

export function GuideProductRef({ productId }: { productId: string }) {
  const product = getProductById(productId);
  if (!product) return null;

  return (
    <article className="card flex h-full flex-col overflow-hidden">
      <Link
        href={`/products/${product.slug}`}
        className="relative block overflow-hidden"
        aria-label={product.name}
      >
        <img
          src={productPlaceholder(product.name, product.category)}
          alt={`${product.name} — demo product image`}
          width={640}
          height={300}
          loading="lazy"
          className="aspect-[21/10] w-full object-cover"
        />
        <ScoreBadge
          score={product.uniSmartScore}
          compact
          className="absolute right-2.5 top-2.5"
        />
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <h4 className="font-display text-sm font-bold leading-snug text-slate-900">
          <Link
            href={`/products/${product.slug}`}
            className="transition-colors hover:text-indigo-600"
          >
            {product.name}
          </Link>
        </h4>
        <div className="mt-2">
          <PriceBlock
            price={product.priceInr}
            previousPrice={product.previousPriceInr}
            size="sm"
          />
        </div>
        <div className="mt-auto flex items-center gap-2 pt-3">
          <DealButton
            href={product.deals[0]?.url ?? '#'}
            size="sm"
            label="View Deal"
            className="flex-1"
          />
          <CompareButton productId={product.id} />
        </div>
      </div>
    </article>
  );
}