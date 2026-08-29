'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Scale, X } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { SearchBar } from '@/components/SearchBar';
import { useCompare } from '@/components/compare/CompareProvider';
import { CATEGORIES } from '@/data/categories';
import { NAV_LINKS } from '@/lib/site';
import { cn } from '@/lib/cn';

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { selected } = useCompare();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/90 backdrop-blur">
      <div className="container-page flex h-16 items-center gap-4 sm:h-18 lg:gap-8">
        <Logo />

        <nav className="hidden flex-1 items-center gap-1 lg:flex" aria-label="Main">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'rounded-lg px-3 py-2 text-sm font-medium transition',
                  active
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                )}
                aria-current={active ? 'page' : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden flex-1 md:block">
          <SearchBar variant="compact" />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/compare"
            className="relative inline-flex h-10 items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:text-indigo-700"
            aria-label={`Compare products (${selected.length} selected)`}
          >
            <Scale className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Compare</span>
            {selected.length > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-1 text-[11px] font-bold text-white">
                {selected.length}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-50 lg:hidden"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute right-0 top-0 flex h-full w-[86%] max-w-sm flex-col overflow-y-auto bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <Logo />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="border-b border-slate-100 px-5 py-4">
              <SearchBar variant="compact" placeholder="Search products and guides…" />
            </div>

            <nav className="flex flex-col px-3 py-3" aria-label="Mobile">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Home
              </Link>
              {NAV_LINKS.map((link) => {
                const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'rounded-lg px-3 py-2.5 text-sm font-medium transition',
                      active
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-slate-700 hover:bg-slate-100',
                    )}
                    aria-current={active ? 'page' : undefined}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="mt-2 border-t border-slate-100 pt-2">
                <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Shop by category
                </p>
                {CATEGORIES.map((category) => (
                  <Link
                    key={category.id}
                    href={`/category/${category.id}`}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-700"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
              <Link
                href="/compare"
                onClick={() => setMobileOpen(false)}
                className="mt-2 flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <span className="inline-flex items-center gap-2">
                  <Scale className="h-4 w-4 text-indigo-600" aria-hidden="true" />
                  Compare products
                </span>
                {selected.length > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1 text-[11px] font-bold text-white">
                    {selected.length}
                  </span>
                )}
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}