import type { Metadata } from 'next';
import { GuideCard } from '@/components/GuideCard';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { EmptyState } from '@/components/ui/EmptyState';
import { BookOpenText } from 'lucide-react';
import { GUIDES } from '@/data/guides';
import { CATEGORIES } from '@/data/categories';

export const metadata: Metadata = {
  title: 'Buying guides',
  description:
    'Plain-language buying guides for Indian students — what to buy, why, and what to skip, with student-friendly budgets.',
};

export default function GuidesPage() {
  return (
    <div className="py-10 sm:py-14">
      <div className="container-page">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Buying guides' },
          ]}
        />

        <div className="mb-10 max-w-3xl">
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Buying guides
          </h1>
          <p className="mt-2 text-slate-600">
            We research, compare and cut through the marketing so you buy once,
            buy right. Every guide ends with a clear recommendation and the deals
            worth clicking.
          </p>
        </div>

        {GUIDES.length === 0 ? (
          <EmptyState
            title="No guides yet"
            description="Guides are being written. Check back soon."
            icon={<BookOpenText className="h-8 w-8" aria-hidden="true" />}
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {GUIDES.map((guide) => (
              <GuideCard key={guide.id} guide={guide} />
            ))}
          </div>
        )}

        <section className="mt-16" aria-labelledby="guide-categories-heading">
          <h2
            id="guide-categories-heading"
            className="font-display text-xl font-bold text-slate-900"
          >
            Browsing guides by category
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <li key={c.id}>
                <a
                  href={`/guides?category=${c.id}`}
                  className="chip"
                  aria-label={`Guides for ${c.name} (coming soon)`}
                >
                  {c.name}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}