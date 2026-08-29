import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { CategoryIcon } from '@/components/CategoryCard';
import { ProductGrid } from '@/components/ProductGrid';
import { CATEGORIES } from '@/data/categories';
import {
  CATEGORY_INTRO,
  CATEGORY_KEYWORDS,
  categoryPageDescription,
  categoryPageTitle,
} from '@/lib/categoryPage';
import { getProductsByCategory } from '@/lib/products';
import { SITE_URL } from '@/lib/site';
import type { CategoryId } from '@/lib/types';

interface CategoryPageParams {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return CATEGORIES.map((category) => ({ slug: category.id }));
}

export function generateMetadata({
  params,
}: CategoryPageParams): Promise<Metadata> {
  return params.then(({ slug }) => {
    const category = CATEGORIES.find((c) => c.id === slug);
    if (!category) return {};
    return {
      title: categoryPageTitle(category),
      description: categoryPageDescription(category),
      alternates: { canonical: `${SITE_URL}/category/${category.id}` },
      category: CATEGORY_KEYWORDS[category.id],
    };
  });
}

export default async function CategoryPage({
  params,
}: CategoryPageParams) {
  const { slug } = await params;
  const category = CATEGORIES.find((c) => c.id === slug);
  if (!category) notFound();

  const products = getProductsByCategory(category.id)
    .slice()
    .sort((a, b) => b.uniSmartScore - a.uniSmartScore);

  const metaDescription = categoryPageDescription(category);
  const intro = CATEGORY_INTRO[category.id as CategoryId];

  return (
    <div className="py-10 sm:py-14">
      <div className="container-page">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ItemList',
              name: categoryPageTitle(category),
              description: metaDescription,
              numberOfItems: products.length,
              itemListElement: products.map((product, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                url: `${SITE_URL}/products/${product.slug}`,
                name: product.name,
              })),
            }),
          }}
        />

        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: category.name },
          ]}
        />

        <header className="mb-8 max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-indigo-600">
            <CategoryIcon categoryId={category.id} className="h-3.5 w-3.5" />
            {products.length} {products.length === 1 ? 'pick' : 'picks'}
          </span>
          <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Best {category.name} for Students in India
          </h1>
          <p className="mt-3 text-base leading-relaxed text-slate-600">
            {category.description} {intro}
          </p>
        </header>

        <ProductGrid products={products} />

        <section className="mt-16" aria-labelledby="other-categories-heading">
          <h2
            id="other-categories-heading"
            className="font-display text-xl font-bold text-slate-900"
          >
            Browse other categories
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {CATEGORIES.filter((c) => c.id !== category.id).map((c) => (
              <li key={c.id}>
                <Link href={`/category/${c.id}`} className="chip">
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