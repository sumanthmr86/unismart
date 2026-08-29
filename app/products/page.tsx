import type { Metadata } from 'next';
import Link from 'next/link';
import { ProductBrowser } from '@/components/ProductBrowser';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { DemoNote } from '@/components/ui/DemoNote';
import { CATEGORIES } from '@/data/categories';
import { PRODUCTS } from '@/data/products';
import type { CategoryId } from '@/lib/types';

interface ProductsPageProps {
  searchParams: Promise<{ q?: string; category?: string }>;
}

export async function generateMetadata({
  searchParams,
}: ProductsPageProps): Promise<Metadata> {
  const { q, category } = await searchParams;
  const matches = CATEGORIES.find((c) => c.id === category);
  const title = q
    ? `Results for “${q}”`
    : matches
      ? `${matches.name} — product picks`
      : 'Browse all products';
  return {
    title,
    description: `Browse ${PRODUCTS.length} curated products for Indian students across ${CATEGORIES.length} categories. Compare, read buying guides and find student-friendly deals.`,
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { q = '', category } = await searchParams;
  const validCategory = CATEGORIES.some((c) => c.id === category)
    ? (category as CategoryId)
    : 'all';

  return (
    <div className="py-10 sm:py-14">
      <div className="container-page">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Products' },
          ]}
        />

        <div className="mb-8 max-w-3xl">
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            {q ? (
              <>
                Results for “<span className="brand-gradient-text">{q}</span>”
              </>
            ) : category && validCategory !== 'all' ? (
              <>
                {CATEGORIES.find((c) => c.id === validCategory)?.name}{' '}
                <span className="text-slate-400">picks</span>
              </>
            ) : (
              'Browse products'
            )}
          </h1>
          <p className="mt-2 text-slate-600">
            {q
              ? 'Here’s what matched your search. Refine with filters below.'
              : 'Curated products for student life — compare prices, scores and deals before you buy.'}
          </p>
        </div>

        <DemoNote className="mb-8 max-w-3xl" />

        <ProductBrowser
          products={PRODUCTS}
          initialQuery={q}
          initialCategory={validCategory}
        />

        <section className="mt-16" aria-labelledby="popular-categories-heading">
          <h2
            id="popular-categories-heading"
            className="font-display text-xl font-bold text-slate-900"
          >
            Popular categories
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <li key={c.id}>
                <Link href={`/products?category=${c.id}`} className="chip">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}