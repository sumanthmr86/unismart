'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { ProductCard } from '@/components/ProductCard';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import { ChevronDown } from 'lucide-react';
import type { Product } from '@/lib/types';
import { cn } from '@/lib/cn';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  skeletonCount?: number;
  className?: string;
  hasMore?: boolean;
  onLoadMore?: () => void;
  initialItems?: number;
  itemsPerLoad?: number;
}

export function ProductGrid({
  products,
  loading = false,
  skeletonCount = 8,
  className,
  hasMore = false,
  onLoadMore,
  initialItems = 12,
  itemsPerLoad = 12,
} : ProductGridProps) {
  const [visibleCount, setVisibleCount] = useState(initialItems);
  const loadMoreRef = useRef<HTMLButtonElement>(null);

  // Reset visible count when products change (e.g., filter/category change)
  useEffect(() => {
    setVisibleCount(initialItems);
  }, [products.length, initialItems]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!hasMore || !onLoadMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          onLoadMore();
        }
      },
      { rootMargin: '200px', threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }
    return () => observer.disconnect();
  }, [hasMore, onLoadMore, loading]);

  const visibleProducts = products.slice(0, visibleCount);
  const showLoadMore = hasMore && visibleCount < products.length;

  const handleLoadMore = useCallback(() => {
    if (onLoadMore && !loading) {
      setVisibleCount((prev) => Math.min(prev + itemsPerLoad, products.length));
      onLoadMore();
    }
  }, [onLoadMore, loading, products.length, itemsPerLoad]);

  if (loading && products.length === 0) {
    return (
      <div
        className="grid grid-cols-1 gap-4 min-[400px]:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4"
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
    <div className="space-y-6">
      <ul
        className={cn(
          'grid grid-cols-1 gap-4 min-[400px]:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4',
          className,
        )}
        role="list"
        aria-label="Products"
      >
        {visibleProducts.map((product) => (
          <li key={product.id} className="h-full">
            <ProductCard product={product} className="h-full" />
          </li>
        ))}
      </ul>

      {showLoadMore && (
        <div className="flex justify-center pt-4 pb-8">
          <button
            ref={loadMoreRef}
            onClick={handleLoadMore}
            disabled={loading}
            className="btn-secondary w-full sm:w-auto min-h-[48px] touch-manipulation flex items-center justify-center gap-2"
            aria-label={loading ? 'Loading more products' : `Load ${itemsPerLoad} more products`}
            aria-busy={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Loading more…
              </>
            ) : (
              <>
                Load more products
                <ChevronDown className="h-5 w-5 transition-transform duration-200" />
              </>
            )}
          </button>
        </div>
      )}

      {products.length === 0 && !loading && (
        <div className="text-center py-16 px-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293H8a1 1 0 01-.707-.293L7.293 7.707a1 1 0 00-1.414 0L4 10.293a1 1 0 010-1.414l2.293-2.293a1 1 0 01.707-.293H17a2 2 0 012 2v7" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No products found</h3>
          <p className="text-slate-600 mb-4">Try adjusting your filters or search terms</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}