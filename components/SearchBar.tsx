'use client';

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, BookOpenText, Search, X } from 'lucide-react';
import { GUIDES } from '@/data/guides';
import { searchProducts } from '@/lib/products';
import { productPlaceholder } from '@/lib/placeholder';
import { cn } from '@/lib/cn';

export function SearchBar({
  variant = 'hero',
  autoFocus = false,
  placeholder = 'What are you looking for?',
}: {
  variant?: 'hero' | 'compact';
  autoFocus?: boolean;
  placeholder?: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [debounced, setDebounced] = useState('');
  const boxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(query.trim()), 150);
    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  const results = useMemo(() => {
    if (!debounced) return { products: [], guides: [] };
    const products = searchProducts(debounced).slice(0, 5);
    const guides = GUIDES.filter((g) =>
      `${g.title} ${g.excerpt}`.toLowerCase().includes(debounced.toLowerCase()),
    ).slice(0, 2);
    return { products, guides };
  }, [debounced]);

  const hasResults = results.products.length > 0 || results.guides.length > 0;
  const showDropdown = open && debounced.length > 0;

  function submit(event: FormEvent) {
    event.preventDefault();
    const q = query.trim();
    if (!q) return;
    setOpen(false);
    router.push(`/products?q=${encodeURIComponent(q)}`);
  }

  const heroStyle = variant === 'hero';

  return (
    <div ref={boxRef} className="relative w-full">
      <form role="search" onSubmit={submit} className="relative">
        <Search
          className={cn(
            'pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400',
            heroStyle ? 'h-5 w-5' : 'h-4 w-4',
          )}
          aria-hidden="true"
        />
        <label htmlFor={`search-${variant}`} className="sr-only">
          Search products and buying guides
        </label>
        <input
          ref={inputRef}
          id={`search-${variant}`}
          type="search"
          inputMode="search"
          autoComplete="off"
          autoFocus={autoFocus}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className={cn(
            'w-full rounded-2xl border bg-white text-slate-900 placeholder:text-slate-400 transition focus:outline-none',
            heroStyle
              ? 'border-slate-200 px-12 py-4 text-base shadow-card focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 sm:py-5 sm:text-lg'
              : 'border-slate-200 px-10 py-2 text-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100',
          )}
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            aria-label="Clear search"
            className={cn(
              'absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600',
              heroStyle ? 'right-12' : 'right-8',
            )}
          >
            <X className={heroStyle ? 'h-4 w-4' : 'h-3.5 w-3.5'} />
          </button>
        )}
        {heroStyle && (
          <button
            type="submit"
            disabled={!query.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:from-indigo-700 hover:to-violet-700 disabled:cursor-not-allowed disabled:opacity-50 sm:px-5 sm:py-3"
          >
            <span className="hidden sm:inline">Search</span>
            <Search className="h-4 w-4 sm:hidden" aria-hidden="true" />
          </button>
        )}
      </form>

      {showDropdown && (
        <div
          role="listbox"
          aria-label="Search suggestions"
          className={cn(
            'absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-elevate',
          )}
        >
          {!hasResults && (
            <p className="px-4 py-6 text-center text-sm text-slate-500">
              No results for “{debounced}”. Try “earbuds”, “laptop” or “backpack”.
            </p>
          )}

          {results.products.length > 0 && (
            <div>
              <p className="px-4 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Products
              </p>
              <ul>
                {results.products.map((product) => (
                  <li key={product.id}>
                    <Link
                      href={`/products/${product.slug}`}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 transition hover:bg-indigo-50/60"
                    >
                      <img
                        src={productPlaceholder(product.name, product.category)}
                        alt=""
                        className="h-9 w-12 shrink-0 rounded-lg object-cover"
                      />
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium text-slate-900">
                          {product.name}
                        </span>
                        <span className="block text-xs text-slate-500">
                          {product.shortRecommendation}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {results.guides.length > 0 && (
            <div className="border-t border-slate-100">
              <p className="px-4 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Buying guides
              </p>
              <ul>
                {results.guides.map((guide) => (
                  <li key={guide.id}>
                    <Link
                      href={`/guides/${guide.slug}`}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 transition hover:bg-indigo-50/60"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                        <BookOpenText className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium text-slate-900">
                          {guide.title}
                        </span>
                        <span className="block text-xs text-slate-500">
                          Buying guide · {guide.readMinutes} min read
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Link
            href={`/products?q=${encodeURIComponent(debounced)}`}
            onClick={() => setOpen(false)}
            className="flex items-center justify-center gap-1.5 border-t border-slate-100 bg-slate-50 px-4 py-3 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50"
          >
            View all results for “{debounced}”
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      )}
    </div>
  );
}