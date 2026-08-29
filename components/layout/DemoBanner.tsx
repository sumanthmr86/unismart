import { Info } from 'lucide-react';

export function DemoBanner() {
  return (
    <div className="bg-slate-900 text-slate-300">
      <div className="container-page flex items-center justify-center gap-2 px-4 py-2 text-center text-[11px] font-medium sm:text-xs">
        <Info className="hidden h-3.5 w-3.5 shrink-0 text-amber-400 sm:block" aria-hidden="true" />
        <span>
          <span className="font-semibold text-white">Demo preview:</span> product data,
          prices, ratings and reviews are placeholders. “View Deal” links are demo URLs.
        </span>
      </div>
    </div>
  );
}