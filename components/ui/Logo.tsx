import Link from 'next/link';
import { GraduationCap } from 'lucide-react';
import { cn } from '@/lib/cn';

export function Logo({
  className,
  link = true,
}: {
  className?: string;
  link?: boolean;
}) {
  const content = (
    <>
      <span
        className={cn(
          'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 shadow-sm',
        )}
        aria-hidden="true"
      >
        <GraduationCap className="h-5 w-5 text-white" strokeWidth={2.2} />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-lg font-extrabold tracking-tight text-slate-900">
          Uni<span className="brand-gradient-text">Smart</span>
        </span>
        <span className="text-[10px] font-medium tracking-tight text-slate-500">
          unismart.store
        </span>
      </span>
    </>
  );

  if (!link) {
    return <div className={cn('flex items-center gap-2.5', className)}>{content}</div>;
  }

  return (
    <Link
      href="/"
      className={cn('flex items-center gap-2.5', className)}
      aria-label="UniSmart — home"
    >
      {content}
    </Link>
  );
}