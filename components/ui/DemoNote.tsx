import { Info } from 'lucide-react';
import { cn } from '@/lib/cn';

export function DemoNote({
  children,
  className,
}: {
  children?: string;
  className?: string;
}) {
  return (
    <p
      className={cn(
        'flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-800',
        className,
      )}
    >
      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>
        {children ??
          'Demo preview — product names, prices, ratings and reviews shown here are placeholders for demonstration only.'}
      </span>
    </p>
  );
}