import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('skeleton rounded-lg', className)} aria-hidden="true" />;
}

export function ProductCardSkeleton() {
  return (
    <div className="card flex flex-col overflow-hidden">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="mt-1 flex items-center gap-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-5 w-12" />
        </div>
        <Skeleton className="mt-2 h-3 w-11/12" />
        <Skeleton className="h-3 w-3/4" />
        <div className="mt-auto grid grid-cols-[1fr_auto] gap-2 pt-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-12" />
        </div>
      </div>
    </div>
  );
}

export function GuideCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <Skeleton className="aspect-[16/9] w-full rounded-none" />
      <div className="flex flex-col gap-3 p-5">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="mt-2 h-9 w-28" />
      </div>
    </div>
  );
}

export function SkeletonParagraph({ lines = 3 }: { lines?: number }) {
  return (
    <div className="flex flex-col gap-2.5" aria-hidden="true">
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton key={i} className={cn('h-4', i === lines - 1 ? 'w-2/3' : 'w-full')} />
      ))}
    </div>
  );
}

export function SectionSkeleton({
  children,
}: {
  children: ReactNode;
}) {
  return <div role="status" aria-label="Loading">{children}</div>;
}