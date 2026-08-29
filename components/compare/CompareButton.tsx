'use client';

import { Scale } from 'lucide-react';
import { useCompare } from '@/components/compare/CompareProvider';
import { cn } from '@/lib/cn';

export function CompareButton({
  productId,
  className,
  variant = 'icon',
  label = 'Compare',
}: {
  productId: string;
  className?: string;
  variant?: 'icon' | 'full';
  label?: string;
}) {
  const { isSelected, toggle, limitReached } = useCompare();
  const active = isSelected(productId);

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={() => toggle(productId)}
        aria-pressed={active}
        title={active ? 'Remove from compare' : 'Add to compare'}
        aria-label={active ? `Remove ${productId} from compare` : `Add ${productId} to compare`}
        className={cn(
          'inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition',
          active
            ? 'border-indigo-600 bg-indigo-600 text-white'
            : 'border-slate-300 bg-white text-slate-500 hover:border-indigo-300 hover:text-indigo-600',
          className,
        )}
      >
        <Scale className="h-5 w-5" aria-hidden="true" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => toggle(productId)}
      aria-pressed={active}
      disabled={!active && limitReached}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50',
        active
          ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
          : 'border-slate-300 bg-white text-slate-700 hover:border-indigo-300 hover:text-indigo-700',
        className,
      )}
    >
      <Scale className="h-4 w-4" aria-hidden="true" />
      {active ? 'Added' : label}
      {limitReached && !active && (
        <span className="sr-only">Compare limit of 4 reached</span>
      )}
    </button>
  );
}