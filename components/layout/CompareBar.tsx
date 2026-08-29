'use client';

import Link from 'next/link';
import { Scale } from 'lucide-react';
import { useCompare } from '@/components/compare/CompareProvider';
import { getProductById } from '@/data/products';
import { productPlaceholder } from '@/lib/placeholder';
import { cn } from '@/lib/cn';

export function CompareBar() {
  const { selected, clear } = useCompare();
  if (selected.length === 0) return null;

  const products = selected
    .map((id) => getProductById(id))
    .filter((p) => p !== undefined);

  return (
    <div
      className="fixed inset-x-0 bottom-16 z-40 border-t border-slate-200 bg-white/95 shadow-[0_-4px_20px_-8px_rgb(15_23_42/0.15)] backdrop-blur md:bottom-0"
      role="region"
      aria-label="Compare tray"
    >
      <div className="container-page flex items-center gap-3 py-3">
        <div className="flex shrink-0 items-center gap-2 text-sm font-semibold text-slate-900">
          <Scale className="h-4 w-4 text-indigo-600" aria-hidden="true" />
          <span>
            <span className="text-indigo-600">{products.length}</span>
            {products.length === 1 ? ' product' : ' products'}
          </span>
        </div>
        <div
          className={cn(
            'hidden flex-1 items-center gap-2 overflow-x-auto sm:flex',
            products.length > 2 ? 'no-scrollbar' : '',
          )}
        >
          {products.map((p) => (
            <Link
              key={p.id}
              href={`/products/${p.slug}`}
              className="flex shrink-0 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-medium text-slate-700 transition hover:border-indigo-300 hover:text-indigo-700"
            >
              <img
                src={p.image ?? productPlaceholder(p.name, p.category)}
                alt=""
                className="h-6 w-8 rounded object-cover"
              />
              <span className="max-w-[140px] truncate sm:max-w-[220px]">{p.name}</span>
            </Link>
          ))}
        </div>
        <div className="ml-auto flex shrink-0 items-center gap-2">
          <button type="button" onClick={clear} className="btn-ghost px-3 py-1.5 text-xs">
            Clear
          </button>
          <Link href="/compare" className="btn-primary px-4 py-2 text-xs">
            Compare
            <span className="sr-only">
              — compare {products.length} selected products
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}