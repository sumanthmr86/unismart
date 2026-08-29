import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/cn';

export function DealButton({
  href,
  className,
  size = 'md',
  label = 'View Deal',
  note,
}: {
  href: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  note?: string;
}) {
  const sizeClasses = {
    sm: 'rounded-lg px-3 py-1.5 text-xs',
    md: 'rounded-xl px-4 py-2.5 text-sm',
    lg: 'rounded-xl px-6 py-3.5 text-base',
  }[size];

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 font-semibold text-white shadow-sm transition hover:from-indigo-700 hover:to-violet-700 active:scale-[0.98]',
        sizeClasses,
        className,
      )}
    >
      {note ? (
        <span className="flex flex-col items-start leading-tight">
          <span>{label}</span>
          <span className="text-[10px] font-normal text-white/80">{note}</span>
        </span>
      ) : (
        <>
          {label}
          <ExternalLink className={cn(size === 'lg' ? 'h-4 w-4' : 'h-3.5 w-3.5')} aria-hidden="true" />
        </>
      )}
    </a>
  );
}