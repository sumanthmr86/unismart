import Link from 'next/link';
import { ArrowRight, BookOpenText, Clock } from 'lucide-react';
import { guidePlaceholder } from '@/lib/placeholder';
import { getCategoryName } from '@/data/categories';
import type { BuyingGuide } from '@/lib/types';

export function GuideCard({ guide }: { guide: BuyingGuide }) {
  return (
    <article className="card group flex flex-col overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-elevate">
      <Link href={`/guides/${guide.slug}`} className="relative block overflow-hidden">
        <img
          src={guidePlaceholder(guide.title, guide.category)}
          alt={`${guide.title} — guide cover`}
          width={640}
          height={360}
          loading="lazy"
          className="aspect-[16/9] w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-lg bg-white/95 px-2.5 py-1 text-xs font-semibold text-indigo-700 shadow-sm backdrop-blur">
          {getCategoryName(guide.category)}
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center gap-3 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1">
            <BookOpenText className="h-3.5 w-3.5" aria-hidden="true" />
            Buying guide
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            {guide.readMinutes} min read
          </span>
        </div>
        <h3 className="font-display text-base font-bold leading-snug text-slate-900">
          <Link
            href={`/guides/${guide.slug}`}
            className="transition-colors hover:text-indigo-600"
          >
            {guide.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">
          {guide.excerpt}
        </p>
        <Link
          href={`/guides/${guide.slug}`}
          className="btn-link group/link mt-4"
        >
          Read the guide
          <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-0.5" />
        </Link>
      </div>
    </article>
  );
}