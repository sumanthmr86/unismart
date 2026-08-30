'use client';

import { useMemo, useRef, useState, useCallback } from 'react';
import { Filter, RotateCcw, Search, SlidersHorizontal } from 'lucide-react';
import { ProductGrid } from '@/components/ProductGrid';
import { EmptyState } from '@/components/ui/EmptyState';
import { FilterBottomSheet } from '@/components/ui/FilterBottomSheet';
import { CATEGORIES } from '@/data/categories';
import { filterProducts, sortProducts } from '@/lib/products';
import { CATEGORY_PRICE_BUCKETS } from '@/lib/priceBuckets';
import type { CategoryId, Product, SortKey } from '@/lib/types';
import { cn } from '@/lib/cn';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import { useToast } from '@/components/ui/Toast';

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price_asc', label: 'Price: low to high' },
  { value: 'price_desc', label: 'Price: high to low' },
  { value: 'rating', label: 'Top rated' },
  { value: 'discount', label: 'Biggest discount' },
];

const LOADING_MS = 350;

export function ProductBrowser({
  products,
  initialQuery = '',
  initialCategory = 'all',
}: {
  products: Product[];
  initialQuery?: string;
  initialCategory?: CategoryId | 'all';
}) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<CategoryId | 'all'>(initialCategory);
  const [priceBucket, setPriceBucket] = useState<number | null>(null);
  const [sort, setSort] = useState<SortKey>('relevance');
  const [loading, setLoading] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);
  const loadingTimer = useRef<number | null>(null);
  const { showToast } = useToast();

  function scheduleLoading() {
    if (loadingTimer.current) window.clearTimeout(loadingTimer.current);
    setLoading(true);
    loadingTimer.current = window.setTimeout(() => setLoading(false), LOADING_MS);
  }

  const currentPriceBuckets = CATEGORY_PRICE_BUCKETS[category];

  const bucket = priceBucket !== null ? currentPriceBuckets[priceBucket] : undefined;

  const result = useMemo(() => {
    const filtered = filterProducts(products, {
      query,
      category,
      minPrice: bucket?.min,
      maxPrice: bucket?.max,
    });
    return sortProducts(filtered, sort);
  }, [products, query, category, bucket, sort]);

  const hasActiveFilters =
    query.trim().length > 0 ||
    category !== 'all' ||
    priceBucket !== null ||
    sort !== 'relevance';

  function clearFilters() {
    setQuery('');
    setCategory('all');
    setPriceBucket(null);
    setSort('relevance');
    scheduleLoading();
    showToast('Filters cleared', 'info');
  }

  const handleLoadMore = useCallback(() => {
    setVisibleCount((prev) => Math.min(prev + 12, result.length));
  }, [result.length]);

  const { ref: pullRef, isPulling, pullDistance, isRefreshing } = usePullToRefresh({
    onRefresh: async () => {
      // Simulate refresh - in real app, this would re-fetch data
      await new Promise((resolve) => setTimeout(resolve, 1000));
      showToast('Products refreshed', 'success');
    },
    threshold: 80,
  });

  const handleCategoryChange = (newCategory: CategoryId | 'all') => {
    setCategory(newCategory);
    setPriceBucket(null);
    setVisibleCount(12);
    scheduleLoading();
  };

  const handlePriceBucketChange = (index: number) => {
    setPriceBucket(priceBucket === index ? null : index);
    setVisibleCount(12);
    scheduleLoading();
  };

  return (
    <div ref={pullRef} className="touch-manipulation">
      {/* Pull to refresh indicator */}
      {isPulling && (
        <div
          className={cn(
            'pull-to-refresh-indicator transition-transform duration-200',
            isRefreshing && 'text-emerald-600',
            pullDistance > 80 && !isRefreshing && 'text-indigo-600'
          )}
          style={{ transform: `translateY(${Math.min(pullDistance, 100)}px)` }}
        >
          {isRefreshing ? (
            <>
              <svg className="animate-spin h-5 w-5 mx-auto" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Refreshing…
            </>
          ) : pullDistance > 80 ? (
            <>
              <svg className="h-5 w-5 mx-auto rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              Release to refresh
            </>
          ) : (
            <>
              <svg className="h-5 w-5 mx-auto transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              Pull to refresh
            </>
          )}
        </div>
      )}

      <div>
        <div className="card flex flex-col gap-4 p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              />
              <label htmlFor="product-search" className="sr-only">
                Search products
              </label>
              <input
                id="product-search"
                type="search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setVisibleCount(12);
                  scheduleLoading();
                }}
                placeholder="Search within products…"
                className="input-base pl-10"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFiltersOpen(true)}
                className="btn-secondary lg:hidden touch-manipulation"
                aria-expanded={filtersOpen}
              >
                <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
                Filters
                {hasActiveFilters && (
                  <span className="ml-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold">
                    ✓
                  </span>
                )}
              </button>
              <label htmlFor="sort-by" className="sr-only">
                Sort products
              </label>
              <select
                id="sort-by"
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value as SortKey);
                  setVisibleCount(12);
                  scheduleLoading();
                }}
                className="input-base w-auto touch-manipulation"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    Sort: {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Mobile filter pills (always visible on mobile when filters open) */}
          <div className={cn('flex flex-col gap-3', filtersOpen ? '' : 'lg:hidden')}>
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              <CategoryPill
                active={category === 'all'}
                onClick={() => handleCategoryChange('all')}
                label="All categories"
              />
              {CATEGORIES.map((c) => (
                <CategoryPill
                  key={c.id}
                  active={category === c.id}
                  onClick={() => handleCategoryChange(c.id)}
                  label={c.name}
                />
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                <Filter className="h-3.5 w-3.5" aria-hidden="true" />
                Price
              </span>
              {CATEGORY_PRICE_BUCKETS[category].map((bucketOpt, index) => (
                <button
                  key={bucketOpt.label}
                  type="button"
                  onClick={() => handlePriceBucketChange(index)}
                  aria-pressed={priceBucket === index}
                  className={cn('chip touch-manipulation', priceBucket === index && 'chip-active')}
                >
                  {bucketOpt.label}
                </button>
              ))}
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="btn-ghost ml-auto items-center gap-1 px-2 py-1 text-xs text-indigo-600 touch-manipulation"
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                  Clear filters
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-slate-500" aria-live="polite">
            {loading ? (
              'Updating results…'
            ) : (
              <>
                <span className="font-semibold text-slate-900">{result.length}</span>{' '}
                {result.length === 1 ? 'product' : 'products'}
                {query.trim() && (
                  <>
                    {' '}for “<span className="font-medium text-slate-700">{query}</span>”
                  </>
                )}
              </>
            )}
          </p>
        </div>

        <div className="mt-4">
          {!loading && result.length === 0 ? (
            <EmptyState
              title="No products match your filters"
              description="Try a different search term, another category, or reset the filters to see all products."
              icon={<svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293H8a1 1 0 01-.707-.293L7.293 7.707a1 1 0 00-1.414 0L4 10.293a1 1 0 010-1.414l2.293-2.293a1 1 0 01.707-.293H17a2 2 0 012 2v7" /></svg>}
              action={
                <button type="button" onClick={clearFilters} className="btn-primary">
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  Clear all filters
                </button>
              }
            />
          ) : (
            <ProductGrid
              products={result}
              loading={loading}
              skeletonCount={Math.min(result.length || 4, 8)}
              hasMore={visibleCount < result.length}
              onLoadMore={handleLoadMore}
              initialItems={12}
              itemsPerLoad={12}
            />
          )}
        </div>
      </div>

      {/* Filter Bottom Sheet */}
      <FilterBottomSheet
        isOpen={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        category={category}
        setCategory={handleCategoryChange}
        priceBucket={priceBucket}
        setPriceBucket={setPriceBucket}
        sort={sort}
        setSort={setSort}
        onClearFilters={clearFilters}
        hasActiveFilters={hasActiveFilters}
        categories={CATEGORIES}
      />
    </div>
  );
}

function CategoryPill({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="chip shrink-0 touch-manipulation"
    >
      {label}
    </button>
  );
}

export { CATEGORY_PRICE_BUCKETS };