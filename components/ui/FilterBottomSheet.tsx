'use client';

import { useEffect, useRef } from 'react';
import { X, Filter } from 'lucide-react';
import { CATEGORY_PRICE_BUCKETS } from '@/lib/priceBuckets';
import { cn } from '@/lib/cn';

import type { CategoryId, SortKey } from '@/lib/types';

interface FilterBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  category: CategoryId | 'all';
  setCategory: (cat: CategoryId | 'all') => void;
  priceBucket: number | null;
  setPriceBucket: (bucket: number | null) => void;
  sort: SortKey;
  setSort: (sort: SortKey) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  categories: { id: string; name: string }[];
}

export function FilterBottomSheet({
  isOpen,
  onClose,
  category,
  setCategory,
  priceBucket,
  setPriceBucket,
  sort,
  setSort,
  onClearFilters,
  hasActiveFilters,
  categories,
}: FilterBottomSheetProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  // Trap focus within the modal
  useEffect(() => {
    if (!isOpen) return;
    const content = contentRef.current;
    if (!content) return;
    const focusableElements = content.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    firstElement?.focus();

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };
    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={contentRef}
        className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl lg:hidden animate-slide-up max-h-[85vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="filter-bottom-sheet-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 sticky top-0 bg-white rounded-t-2xl z-10">
          <h2 id="filter-bottom-sheet-title" className="font-display text-lg font-semibold text-slate-900">
            Filters
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
            aria-label="Close filters"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-8">
          {/* Category */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-slate-900">Category</h3>
              <button
                type="button"
                onClick={() => {
                  setCategory('all');
                  onClose();
                }}
                className="text-sm text-indigo-600 font-medium"
              >
                All
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setCategory(cat.id as CategoryId | 'all');
                    onClose();
                  }}
                  className={cn(
                    'chip shrink-0',
                    category === cat.id && 'chip-active'
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <Filter className="h-5 w-5 text-slate-500" />
              Price
            </h3>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_PRICE_BUCKETS[category as keyof typeof CATEGORY_PRICE_BUCKETS]?.map((bucketOpt, index) => (
                <button
                  key={bucketOpt.label}
                  type="button"
                  onClick={() => {
                    setPriceBucket(priceBucket === index ? null : index);
                  }}
                  className={cn('chip', priceBucket === index && 'chip-active')}
                >
                  {bucketOpt.label}
                </button>
              )) || []}
            </div>
          </div>

          {/* Sort */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-3">Sort by</h3>
            <div className="space-y-2">
              {[
                { value: 'relevance', label: 'Relevance' },
                { value: 'price_asc', label: 'Price: low to high' },
                { value: 'price_desc', label: 'Price: high to low' },
                { value: 'rating', label: 'Top rated' },
                { value: 'discount', label: 'Biggest discount' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setSort(opt.value as SortKey)}
                  className={cn(
                    'w-full text-left p-3 rounded-xl border transition-colors',
                    sort === opt.value
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                  )}
                >
                  <span className="font-medium text-slate-900">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              className="w-full btn-secondary mt-4"
            >
              Clear all filters
            </button>
          )}
        </div>
      </div>
    </>
  );
}