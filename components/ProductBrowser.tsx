'use client';

import { useMemo, useRef, useState } from 'react';
import { Filter, PackageSearch, RotateCcw, Search, SlidersHorizontal } from 'lucide-react';
import { ProductGrid } from '@/components/ProductGrid';
import { EmptyState } from '@/components/ui/EmptyState';
import { CATEGORIES } from '@/data/categories';
import { filterProducts, sortProducts } from '@/lib/products';
import type { CategoryId, Product, SortKey } from '@/lib/types';
import { cn } from '@/lib/cn';

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price_asc', label: 'Price: low to high' },
  { value: 'price_desc', label: 'Price: high to low' },
  { value: 'rating', label: 'Top rated' },
  { value: 'discount', label: 'Biggest discount' },
];

const CATEGORY_PRICE_BUCKETS: Record<CategoryId | 'all', { label: string; min: number | undefined; max: number | undefined }[]> = {
  all: [
    { label: 'Under ₹500', min: undefined, max: 500 },
    { label: '₹500 – ₹2,000', min: 500, max: 2000 },
    { label: '₹2,000 – ₹10,000', min: 2000, max: 10000 },
    { label: 'Above ₹10,000', min: 10000, max: undefined },
  ],
  laptops: [
    { label: 'Under ₹30,000', min: undefined, max: 30000 },
    { label: '₹30,000 – ₹60,000', min: 30000, max: 60000 },
    { label: '₹60,000 – ₹1,00,000', min: 60000, max: 100000 },
    { label: 'Above ₹1,00,000', min: 100000, max: undefined },
  ],
  audio: [
    { label: 'Under ₹1,000', min: undefined, max: 1000 },
    { label: '₹1,000 – ₹3,000', min: 1000, max: 3000 },
    { label: '₹3,000 – ₹5,000', min: 3000, max: 5000 },
    { label: 'Above ₹5,000', min: 5000, max: undefined },
  ],
  accessories: [
    { label: 'Under ₹500', min: undefined, max: 500 },
    { label: '₹500 – ₹2,000', min: 500, max: 2000 },
    { label: '₹2,000 – ₹5,000', min: 2000, max: 5000 },
    { label: 'Above ₹5,000', min: 5000, max: undefined },
  ],
  backpacks: [
    { label: 'Under ₹500', min: undefined, max: 500 },
    { label: '₹500 – ₹1,500', min: 500, max: 1500 },
    { label: '₹1,500 – ₹3,000', min: 1500, max: 3000 },
    { label: 'Above ₹3,000', min: 3000, max: undefined },
  ],
  'power-charging': [
    { label: 'Under ₹1,000', min: undefined, max: 1000 },
    { label: '₹1,000 – ₹3,000', min: 1000, max: 3000 },
    { label: '₹3,000 – ₹5,000', min: 3000, max: 5000 },
    { label: 'Above ₹5,000', min: 5000, max: undefined },
  ],
  'study-setup': [
    { label: 'Under ₹1,000', min: undefined, max: 1000 },
    { label: '₹1,000 – ₹3,000', min: 1000, max: 3000 },
    { label: '₹3,000 – ₹5,000', min: 3000, max: 5000 },
    { label: 'Above ₹5,000', min: 5000, max: undefined },
  ],
  'hostel-essentials': [
    { label: 'Under ₹500', min: undefined, max: 500 },
    { label: '₹500 – ₹1,500', min: 500, max: 1500 },
    { label: '₹1,500 – ₹3,000', min: 1500, max: 3000 },
    { label: 'Above ₹3,000', min: 3000, max: undefined },
  ],
  tablets: [
    { label: 'Under ₹10,000', min: undefined, max: 10000 },
    { label: '₹10,000 – ₹20,000', min: 10000, max: 20000 },
    { label: '₹20,000 – ₹30,000', min: 20000, max: 30000 },
    { label: 'Above ₹30,000', min: 30000, max: undefined },
  ],
  stationery: [
    { label: 'Under ₹200', min: undefined, max: 200 },
    { label: '₹200 – ₹500', min: 200, max: 500 },
    { label: '₹500 – ₹1,000', min: 500, max: 1000 },
    { label: 'Above ₹1,000', min: 1000, max: undefined },
  ],
  monitors: [
    { label: 'Under ₹10,000', min: undefined, max: 10000 },
    { label: '₹10,000 – ₹20,000', min: 10000, max: 20000 },
    { label: '₹20,000 – ₹30,000', min: 20000, max: 30000 },
    { label: 'Above ₹30,000', min: 30000, max: undefined },
  ],
};

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
  const loadingTimer = useRef<number | null>(null);

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
  }

  return (
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
                scheduleLoading();
              }}
              placeholder="Search within products…"
              className="input-base pl-10"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFiltersOpen((v) => !v)}
              className="btn-secondary lg:hidden"
              aria-expanded={filtersOpen}
            >
              <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
              Filters
            </button>
            <label htmlFor="sort-by" className="sr-only">
              Sort products
            </label>
            <select
              id="sort-by"
              value={sort}
              onChange={(e) => {
                setSort(e.target.value as SortKey);
                scheduleLoading();
              }}
              className="input-base w-auto"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  Sort: {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={cn('flex flex-col gap-3', filtersOpen ? '' : 'lg:hidden')}>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            <CategoryPill
              active={category === 'all'}
              onClick={() => {
                setCategory('all');
                setPriceBucket(null);
                scheduleLoading();
              }}
              label="All categories"
            />
            {CATEGORIES.map((c) => (
              <CategoryPill
                key={c.id}
                active={category === c.id}
                onClick={() => {
                  setCategory(c.id);
                  setPriceBucket(null);
                  scheduleLoading();
                }}
                label={c.name}
              />
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <Filter className="h-3.5 w-3.5" aria-hidden="true" />
              Price
            </span>
            {currentPriceBuckets.map((bucketOpt, index) => (
              <button
                key={bucketOpt.label}
                type="button"
                onClick={() => {
                  setPriceBucket((prev) => (prev === index ? null : index));
                  scheduleLoading();
                }}
                aria-pressed={priceBucket === index}
                className={cn('chip', priceBucket === index && 'chip-active')}
              >
                {bucketOpt.label}
              </button>
            ))}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="btn-ghost ml-auto items-center gap-1 px-2 py-1 text-xs text-indigo-600"
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
            icon={<PackageSearch className="h-8 w-8" aria-hidden="true" />}
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
          />
        )}
      </div>
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
      className={cn('chip shrink-0', active && 'chip-active')}
    >
      {label}
    </button>
  );
}