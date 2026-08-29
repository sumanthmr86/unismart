import type { ReactNode } from 'react';
import { SearchX } from 'lucide-react';

export function EmptyState({
  title,
  description,
  action,
  icon,
  className,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center ${className ?? ''}`}
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-card">
        {icon ?? <SearchX className="h-8 w-8" aria-hidden="true" />}
      </div>
      <h3 className="font-display text-lg font-bold text-slate-900">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-md text-sm text-slate-600">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}