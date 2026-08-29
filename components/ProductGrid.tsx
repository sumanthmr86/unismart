import { ProductCard } from '@/components/ProductCard';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import type { Product } from '@/lib/types';
import { cn } from '@/lib/cn';

export function ProductGrid({
  products,
  loading = false,
  skeletonCount = 8,
  className,
}: {
  products: Product[];
  loading?: boolean;
  skeletonCount?: number;
  className?: string;
}) {
  if (loading) {
    return (
      <div
        className={cn(
          'grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4',
          className,
        )}
        role="status"
        aria-label="Loading products"
      >
        {Array.from({ length: skeletonCount }, (_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
        <span className="sr-only">Loading products…</span>
      </div>
    );
  }

  return (
    <ul
      className={cn(
        'grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4',
        className,
      )}
    >
      {products.map((product) => (
        <li key={product.id} className="h-full">
          <ProductCard product={product} className="h-full" />
        </li>
      ))}
    </ul>
  );
}