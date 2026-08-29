import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/cn';

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  href,
  linkLabel = 'View all',
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  href?: string;
  linkLabel?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'mb-8 flex flex-wrap items-end justify-between gap-4',
        className,
      )}
    >
      <div className="max-w-2xl">
        {eyebrow && <span className="eyebrow mb-3">{eyebrow}</span>}
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          {title}
        </h2>
        {subtitle && <p className="mt-2 text-slate-600">{subtitle}</p>}
      </div>
      {href && (
        <Link href={href} className="btn-link group" aria-label={`${linkLabel}: ${title}`}>
          {linkLabel}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}