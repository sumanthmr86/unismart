'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Package, Scale, Zap } from 'lucide-react';
import { useCompare } from '@/components/compare/CompareProvider';
import { cn } from '@/lib/cn';

const ITEMS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/products', label: 'Products', icon: Package },
  { href: '/deals', label: 'Deals', icon: Zap },
  { href: '/compare', label: 'Compare', icon: Scale },
] as const;

export function MobileNav() {
  const pathname = usePathname();
  const { selected } = useCompare();

  return (
    <nav
      aria-label="Mobile"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur md:hidden"
    >
      <div className="mx-auto flex h-16 max-w-md items-stretch justify-around px-2 pb-[env(safe-area-inset-bottom)]">
        {ITEMS.map((item) => {
          const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(`${item.href}/`));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl text-[11px] font-semibold transition active:scale-95',
                active ? 'text-indigo-700' : 'text-slate-500 hover:text-slate-700',
              )}
              aria-current={active ? 'page' : undefined}
            >
              <span className="relative flex h-7 w-7 items-center justify-center">
                <Icon className="h-[22px] w-[22px]" aria-hidden="true" />
                {item.href === '/compare' && selected.length > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-1 text-[9px] font-bold text-white">
                    {selected.length}
                  </span>
                )}
              </span>
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}